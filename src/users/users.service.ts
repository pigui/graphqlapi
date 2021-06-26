import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, throwError } from 'rxjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findUsers(): Observable<User[]> {
    return from(this.userModel.find());
  }

  findUserById(id: string): Observable<User> {
    return from(this.userModel.findById(id));
  }

  findUserByEmail(email: string): Observable<User> {
    return from(this.userModel.findOne({ email }));
  }

  createUser(createUserDto: CreateUserDto): Observable<User> {
    const password = bcrypt.hashSync(createUserDto.password);
    const user = new this.userModel({ ...createUserDto, password });
    return from(user.save()).pipe(
      catchError((error) => {
        return throwError(new ConflictException(error));
      }),
    );
  }
}
