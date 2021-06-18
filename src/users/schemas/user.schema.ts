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
  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  lastname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
