import {Resolver, Query, Field, InputType, Mutation, Arg, Ctx, ObjectType} from "type-graphql";
import {MyContext} from "../types";
import argon2 from "argon2"
import {User} from "../entities/User";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password:string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse { //Either errors or user can be returned, in 1 class and optional
    @Field(()=> [FieldError], {nullable:true})
    errors?: FieldError[]

    @Field(()=> User, {nullable:true})
    user?:User
}

@Resolver()
export class UserResolver {
    @Query(()=> User, {nullable: true})
    async me(
        @Ctx() {em, req}: MyContext
    ){
        //you are not logged in
        if(!req.session.userId){
            return null
        }
        const user = await em.findOne(User, {id:req.session.userId});
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        if(options.username.length <=2){
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }

        //Could also use a validation library to add more rules
        if(options.password.length <=2){
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be greater than 2'
                }]
            }
        }

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username.toLowerCase(),
            password: hashedPassword
            });
        try {
            await em.persistAndFlush(user);
        } catch(err) {
            if(err.code === '23505'){// || err.detail.incudes("already exists")){
                //duplicate username error
                return {
                    errors:[{
                        field:'username',
                        message:'username already taken'
                    }]
                }
            }
            console.log(err.message)
        }

        //store userid session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id;
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(User, {username: options.username.toLowerCase()});
        if (!user){
            return {
                errors:[{
                    field: 'username',
                    message: "that username doesn't exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, options.password)
        if (!valid){
            return {
                errors:[{
                    field: 'password',
                    message: "incorrect password" //Could also always return "invalid login" if you dont want to tell them what they did wrong.
                }]
            }
        }

        req.session.userId = user.id;

        return {
            user
        };
    }
}
