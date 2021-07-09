import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';
import { Observable } from 'rxjs';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/core/guards/gql-auth.guard';
import { PubSub } from 'apollo-server-express';
import { tap } from 'rxjs/operators';

@Resolver()
export class BlogsResolver {
  constructor(
    private readonly blogsService: BlogsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [BlogDto])
  findBlogs(): Observable<Blog[]> {
    return this.blogsService.findBlogs();
  }

  @Query(() => BlogDto)
  findBlogById(@Args('id') id: string): Observable<Blog> {
    return this.blogsService.findBlogById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlogDto)
  createBlog(
    @Args('createBlogInput') createBlogDto: CreateBlogDto,
    @CurrentUser() user: User,
  ): Observable<Blog> {
    return this.blogsService
      .createBlog(createBlogDto, user)
      .pipe(
        tap((blogCreated: Blog) =>
          this.pubSub.publish('blogCreated', { blogCreated }),
        ),
      );
  }
  @Subscription(() => BlogDto)
  blogCreated() {
    return this.pubSub.asyncIterator<Blog>('blogCreated');
  }
}
