import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, Comment } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { switchMap, tap } from 'rxjs/operators';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  findBlogs(): Observable<Blog[]> {
    return from(this.blogModel.find().populate('user'));
  }

  findBlogById(id: string): Observable<Blog> {
    return from(this.blogModel.findById(id).populate('user'));
  }

  createBlog(createBlogDto: CreateBlogDto, user: User): Observable<Blog> {
    const blog = new this.blogModel({ ...createBlogDto });
    blog.user = user._id;
    return from(blog.save()).pipe(
      switchMap((blogNew) => {
        return from(this.blogModel.findById(blogNew._id).populate('user'));
      }),
    );
  }

  createComment(
    blogId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Observable<Blog> {
    return from(this.blogModel.findById(blogId)).pipe(
      switchMap((blog) => {
        const comment = new Comment();
        comment.text = createCommentDto.text;
        return from(blog.save());
      }),
    );
  }
}
