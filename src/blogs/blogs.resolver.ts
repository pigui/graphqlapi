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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlogDto)
  createComment(
    @Args('blogId') blogId: string,
    @Args('createCommentInput') createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.blogsService.createComment(blogId, createCommentDto, user).pipe(
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdated', { blogUpdated }),
      ),
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdatedById', {
          blogUpdatedById: blogUpdated,
        }),
      ),
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlogDto)
  updateBlog(
    @Args('blogId') blogId: string,
    @Args('updateBlogInput') updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.updateBlog(blogId, updateBlogDto).pipe(
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdated', { blogUpdated }),
      ),
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdatedById', {
          blogUpdatedById: blogUpdated,
        }),
      ),
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlogDto)
  removeBlog(@Args('blogId') blogId: string): Observable<Blog> {
    return this.blogsService
      .removeBlog(blogId)
      .pipe(
        tap((blogRemoved: Blog) =>
          this.pubSub.publish('blogRemoved', { blogRemoved }),
        ),
      );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlogDto)
  removeComment(
    @Args('blogId') blogId: string,
    @Args('commentId') commentId: string,
  ): Observable<Blog> {
    return this.blogsService.removeComment(blogId, commentId).pipe(
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdated', { blogUpdated }),
      ),
      tap((blogUpdated: Blog) =>
        this.pubSub.publish('blogUpdatedById', {
          blogUpdatedById: blogUpdated,
        }),
      ),
    );
  }

  @Subscription(() => BlogDto)
  blogCreated() {
    return this.pubSub.asyncIterator<Blog>('blogCreated');
  }

  @Subscription(() => BlogDto)
  blogRemoved() {
    return this.pubSub.asyncIterator<Blog>('blogRemoved');
  }

  @Subscription(() => BlogDto)
  blogUpdated() {
    return this.pubSub.asyncIterator<Blog>('blogUpdated');
  }

  @Subscription(() => BlogDto, {
    filter: (payload, filter) => {
      return payload.blogUpdatedById._id.toString() === filter.blogId;
    },
  })
  blogUpdatedById(@Args('blogId') blogId: string) {
    return this.pubSub.asyncIterator<Blog>('blogUpdatedById');
  }
}
