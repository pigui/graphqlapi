import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateBlogInput')
export class CreateBlogDto {
  @Field()
  title: string;

  @Field()
  description: string;
}
