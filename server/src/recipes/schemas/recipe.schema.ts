import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Tag } from '../../tags/schemas/tag.schema';
import { Ingredient } from './ingredient.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Recipe {
  @Prop({ required: true })
  name: string;

  @Prop([
    {
      gramAmount: { type: Number, required: true },
      ingredient: {
        type: Types.ObjectId,
        ref: Ingredient.name,
        required: true,
      },
    },
  ])
  ingredients: { gramAmount: number; ingredient: Types.ObjectId }[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  creator: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags: Types.ObjectId[];

  @Prop({ required: true })
  preperationTimeMinutes: number;

  @Prop({ required: true })
  preperation: string[];

  @Prop()
  image: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
