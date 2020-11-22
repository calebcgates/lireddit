import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field(()=> Int)
  @PrimaryKey()
  id!: number;

  //just good fields to have
  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  //just a title column
  @Field() // NOTE: Can comment out @Field to not expose to grpahql query, in DB but not queryable
  @Property({ type: "text" })
  title!: string;
}
