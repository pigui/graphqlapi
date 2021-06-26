import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/schemas/user.schema';

@ObjectType('AccessToken')
export class AccessTokenDto {
  @Field()
  accessToken: string;

  @Field(() => UserDto)
  user: User;
}
