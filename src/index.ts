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
import {UserResolver} from "./resolvers/user";

import redis from 'redis';
import session from 'express-session'
import connectRedis from 'connect-redis';
import {MyContext} from "./types";


const main = async () => {
  console.log("dirname: ", __dirname);
  const orm = await MikroORM.init(microConfig);
  await orm
    .getMigrator()
    .up(); /** Runs migrations before it does anything else */

  const app = express();

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__ //cookie only works in https -- Also may only want ot set to true once you get it all setup
      },
      saveUninitialized: false,
      secret: 'uybipnoadfjahkgsdf', //Usually want to hid this in an ENV variable
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({req, res}): MyContext => ({ em: orm.em, req, res }) //context allows me to make mikro-orm available to all my resolvers for graphql
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
