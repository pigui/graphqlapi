import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateUserInput')
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  @Field()
  lastname: string;
}
