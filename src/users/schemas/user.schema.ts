import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

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
export class User {
  @Prop({ unique: true, index: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  password: string;

  @Prop({ lowercase: true, trim: true })
  name: string;

  @Prop({ lowercase: true, trim: true })
  lastname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
