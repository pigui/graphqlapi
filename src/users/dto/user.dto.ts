import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
