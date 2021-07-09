import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateCommentInput')
export class CreateCommentDto {
  @Field()
  text: string;
}
