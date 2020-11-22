import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(()=> Int)
  @PrimaryKey()
  id!: number;

  //just good fields to have
  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  //just good fields to have
  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() // NOTE: Can comment out @Field to not expose to grpahql query, in DB but not queryable
  @Property({ type: "text", unique: true }) //Only one person can have each username.
  username!: string;

  //REMOVE @field: Allows you not to select a password@Field() // NOTE: Can comment out @Field to not expose to grpahql query, in DB but not queryable
  @Property({ type: "text"})
  password!: string;
}
