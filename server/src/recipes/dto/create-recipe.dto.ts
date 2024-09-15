export class CreateRecipeDto {
  name: string;
  ingredients: { gramAmount: number; ingredient: IngredientDto }[];
  tags: TagDto[];
  preperationTimeMinutes: number;
  preperation: string[];
  creator: string;
  image: string;
}

export class TagDto {
  name: string;
}

export class IngredientDto {
  name: string;
}
