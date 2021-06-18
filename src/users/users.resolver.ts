import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PubSub } from 'apollo-server-express';
import { Inject } from '@nestjs/common';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [UserDto])
  findUsers(): Observable<User[]> {
    return this.usersService.findUsers();
  }

  @Query(() => UserDto)
  findUserById(@Args('id') id: string): Observable<User> {
    return this.usersService.findUserById(id);
  }

  @Query(() => UserDto)
  findUserByEmail(@Args('email') email: string): Observable<User> {
    return this.usersService.findUserByEmail(email);
  }

  @Mutation(() => UserDto)
  createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
    return this.usersService
      .createUser(createUserDto)
      .pipe(
        tap((userCreated: User) =>
          this.pubSub.publish('userCreated', { userCreated }),
        ),
      );
  }

  @Subscription(() => UserDto)
  userCreated() {
    return this.pubSub.asyncIterator<User>('userCreated');
  }
}
