import {Resolver, Query, Ctx, Arg, Mutation} from "type-graphql";
import { Post} from "../entities/Post";
import {MyContext} from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post]) //Syntax: Type is array [] of Posts
    posts(
        @Ctx() { em }: MyContext
    ): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true }) //Syntax: Graphql type is Post with option to be null
    post(
        @Arg('id') id: number, //name:'id' is what it's called in the graphql schema when you query.
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)  //Mutation is for Create, update, delete
    async createPost(
        @Arg("title") title: string, // Thinks typegraphql can determine type based on typescript type
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable: true}) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if(!post){
            return null;
        }
        if (typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        await em.nativeDelete(Post, {id});
        return true;
    }

}
