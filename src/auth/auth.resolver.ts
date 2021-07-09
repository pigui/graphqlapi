import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/accessToken.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from './current-user.decorator';
import { UsersService } from '../users/users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../core/guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => AccessTokenDto)
  login(@Args('loginInput') loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDto)
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
