import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Ingredient {
  @Prop({ required: true, unique: true })
  name: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
