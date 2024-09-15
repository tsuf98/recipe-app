import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Tag {
  @Prop({ required: true, unique: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
