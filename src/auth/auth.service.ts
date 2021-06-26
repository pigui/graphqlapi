import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { map, switchMap } from 'rxjs/operators';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { from, of, Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/accessToken.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateUser(loginDto: LoginDto): Observable<AccessTokenDto> {
    const { email, password } = loginDto;
    return this.usersService.findUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) throw new NotFoundException('not found');
        return from(bcrypt.compare(password, user.password)).pipe(
          switchMap((compare) => {
            if (!compare)
              throw new UnauthorizedException('password/email incorrect');
            return this.login(user);
          }),
        );
      }),
    );
  }

  private login(user: User): Observable<AccessTokenDto> {
    const accessToken: AccessTokenDto = new AccessTokenDto();
    accessToken.user = user;
    accessToken.accessToken = this.jwtService.sign({
      id: (user as any)._id,
      email: user.email,
    });
    return of(accessToken);
  }
}
