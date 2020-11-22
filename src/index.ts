import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";

const main = async () => {
  console.log("dirname: ", __dirname);
  const orm = await MikroORM.init(microConfig);
  await orm
    .getMigrator()
    .up(); /** Runs migrations before it does anything else */

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({ em: orm.em }) //context allows me to make mikro-orm available to all my resolvers for graphql
  });

  apolloServer.applyMiddleware({app});

  // Example of Basic Endpoint.  Can go to localhost:4000 in chrome and see the word 'hello'.  We will be using graphql not REST so this is commented out
  // app.get('/', (_, res)=>{
  //   res.send("hello");
  // })
  app.listen(4000,()=>{
    console.log('server started on localhost:4000')
  })
  //const post = orm.em.create(Post, { title: "my first post" }); //This does nothing to the db yet
  //await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post,{});
  // console.log(posts);

  // console.log("hello there whats how are you big world");
};

main().catch((err) => {
  console.error(err);
});
