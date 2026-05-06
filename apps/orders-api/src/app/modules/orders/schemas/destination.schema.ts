import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DestinationDocument = HydratedDocument<Destination>;

@Schema()
export class Destination {
  @Prop({ required: true })
  lat!: number;

  @Prop({ required: true })
  lng!: number;

  @Prop({ required: true })
  address!: string;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
