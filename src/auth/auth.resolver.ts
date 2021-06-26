import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/accessToken.dto';
import { LoginDto } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AccessTokenDto)
  login(@Args('loginInput') loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }
}
