import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop()
  favouriteStops: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
