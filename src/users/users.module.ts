import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { PubSub } from 'apollo-server-express';
import { User, UserSchema } from './schemas/user.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
