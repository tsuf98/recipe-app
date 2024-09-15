export interface User {
  _id: string;
  name: string;
  email: string;
  preferedTags: string[];
  maxPreferedPreperationTimeMinutes: number;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Ingredient {
  _id?: string;
  name: string;
}

export interface RecipeIngredient {
  _id: string;
  gramAmount: number;
  ingredient: Ingredient;
}

export interface Recipe {
  _id: string;
  name: string;
  ingredients?: RecipeIngredient[];
  tags?: Tag[];
  preperationTimeMinutes: number;
  preperation?: string[];
  creator: { name: string; _id: string };
  image: string;
  isCreatedByMe?: boolean;
}
