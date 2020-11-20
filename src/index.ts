import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  console.log("dirname: ", __dirname);
  const orm = await MikroORM.init(microConfig);
  await orm
    .getMigrator()
    .up(); /** Runs migrations before it does anything else */

  //const post = orm.em.create(Post, { title: "my first post" }); //This does nothing to the db yet
  //await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post,{});
  console.log(posts);

  // console.log("hello there whats how are you big world");
};

main().catch((err) => {
  console.error(err);
});
