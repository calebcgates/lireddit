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
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ){
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username.toLowerCase(),
            password: hashedPassword
            });
        await em.persistAndFlush(user);
        return user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
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
        return {
            user
        };
    }
}
