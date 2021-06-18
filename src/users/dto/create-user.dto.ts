import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateUserType')
export class CreateUserDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  lastName: string;
}
