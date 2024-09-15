import { forwardRef } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Tag } from '../../tags/schemas/tag.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  preferedTags: Types.ObjectId[];

  @Prop()
  maxPreferedPreperationTimeMinutes: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
