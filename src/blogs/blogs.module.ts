import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsResolver } from './blogs.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema, CommentSchema } from './schemas/blog.schema';
import { UsersModule } from 'src/users/users.module';
import { PubSub } from 'apollo-server-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    UsersModule,
  ],
  providers: [
    BlogsService,
    BlogsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class BlogsModule {}
