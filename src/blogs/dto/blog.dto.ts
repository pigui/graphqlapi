import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../users/dto/user.dto';

@ObjectType('Comment')
export class CommentDto {
  @Field()
  id: string;

  @Field(() => UserDto)
  user: UserDto;

  @Field()
  text: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType('Blog')
export class BlogDto {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => UserDto)
  user: UserDto;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [CommentDto])
  comments: CommentDto[];
}
