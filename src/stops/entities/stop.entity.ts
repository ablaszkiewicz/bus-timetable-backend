import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StopDocument = HydratedDocument<Stop>;

@Schema()
export class Stop {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  lat: number;

  @Prop()
  lon: number;
}

export const StopSchema = SchemaFactory.createForClass(Stop);
