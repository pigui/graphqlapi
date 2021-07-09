import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Comment {
  @Prop({ lowercase: true, trim: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type BlogDocument = Blog & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Blog {
  @Prop({ lowercase: true, trim: true })
  title: string;

  @Prop({ lowercase: true, trim: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [CommentSchema] })
  comments: [Comment];

}

export const BlogSchema = SchemaFactory.createForClass(Blog);
