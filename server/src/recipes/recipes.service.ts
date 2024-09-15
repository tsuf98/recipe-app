import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateRecipeDto,
  IngredientDto,
  TagDto,
} from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe } from './schemas/recipe.schema';
import { Model } from 'mongoose';
import { Ingredient } from './schemas/ingredient.schema';
import { Tag } from '../tags/schemas/tag.schema';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);
  constructor(
    @InjectModel(Recipe.name) private RecipeModel: Model<Recipe>,
    @InjectModel(Ingredient.name) private IngredientModel: Model<Ingredient>,
    @InjectModel(Tag.name) private TagModel: Model<Tag>,
  ) {}

  upsertTags(tags: TagDto[]) {
    return Promise.all(
      tags.map(async (tag) => {
        if (typeof tag === 'string') {
          return tag;
        }
        const existingTag = await this.TagModel.findOneAndUpdate(
          { name: tag.name },
          { $setOnInsert: { name: tag.name } },
          { new: true, upsert: true },
        );
        return existingTag._id;
      }),
    );
  }

  async upsertIngredient(ingredient: IngredientDto) {
    const existingIngredient = await this.IngredientModel.findOneAndUpdate(
      { name: ingredient.name },
      { $setOnInsert: { name: ingredient.name } },
      { new: true, upsert: true },
    );
    return existingIngredient._id;
  }

  async create(createRecipeDto: CreateRecipeDto) {
    const data = {
      ...createRecipeDto,
      tags: await this.upsertTags(createRecipeDto.tags),
      ingredients: await Promise.all(
        createRecipeDto.ingredients.map(async (ingredient) => ({
          gramAmount: ingredient.gramAmount,
          ingredient: await this.upsertIngredient(ingredient.ingredient),
        })),
      ),
    };
    return this.RecipeModel.create(data);
  }

  async findAll(tags?: string[]) {
    const match = !!tags ? { tags: { $in: tags } } : {};
    const recipes = await this.RecipeModel.find(match)
      .populate([
        { path: 'tags', select: 'name' },
        { path: 'creator', select: { name: 1, _id: 0 } },
      ])
      .select({ ingredients: 0, preperation: 0 });

    return recipes;
  }

  async findRecommended(
    preferedTags?: string[],
    maxPreferedPreperationTimeMinutes?: number,
  ) {
    const personalRecommendation = [];
    const presonalMatch: Record<string, any> = {};
    if (preferedTags) {
      presonalMatch.tags = { $in: preferedTags };
    }
    if (maxPreferedPreperationTimeMinutes) {
      presonalMatch.preperationTimeMinutes = {
        $gte: maxPreferedPreperationTimeMinutes,
      };
    }

    if (Object.keys(presonalMatch).length) {
      personalRecommendation.push(
        ...(await this.RecipeModel.find(presonalMatch)
          .populate([
            { path: 'tags', select: 'name' },
            { path: 'creator', select: { name: 1, _id: 0 } },
            { path: 'ingredients.ingredient', select: 'name' },
          ])
          .select({ preperation: 0 })
          .sort({ updatedAt: 'desc' })
          .limit(2)),
      );
    }

    const generalRecommendation = await this.RecipeModel.find({
      _id: { $nin: personalRecommendation.map((r) => r._id) },
    })
      .populate([
        { path: 'tags', select: 'name' },
        { path: 'creator', select: { name: 1, _id: 0 } },
        { path: 'ingredients.ingredient', select: 'name' },
      ])
      .select({ preperation: 0 })
      .sort({ updatedAt: 'desc' })
      .limit(2 - personalRecommendation.length);

    return [...personalRecommendation, ...generalRecommendation].slice(0, 2);
  }

  async findOne(id: string, userId?: string) {
    const recipe = await this.RecipeModel.findById(id)
      .populate([
        { path: 'tags', select: 'name' },
        { path: 'creator', select: { name: 1, _id: 1 } },
        { path: 'ingredients.ingredient', select: 'name' },
      ])
      .exec();
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const existingRecipe = await this.RecipeModel.findById(id);
    if (!existingRecipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (
      existingRecipe.creator.toString() !== updateRecipeDto.creator.toString()
    ) {
      throw new UnauthorizedException('Only recipe creator can edit it');
    }

    if (
      updateRecipeDto.image &&
      updateRecipeDto.image !== existingRecipe.image
    ) {
      try {
        unlinkSync(join(__dirname, '../../', existingRecipe.image));
      } catch (error) {
        this.logger.error(`Image not found: ${existingRecipe.image}`);
      }
    }

    let ingredients, tags;
    if (updateRecipeDto.ingredients) {
      ingredients = await Promise.all(
        updateRecipeDto.ingredients.map(async (ingredient) => ({
          gramAmount: ingredient.gramAmount,
          ingredient: await this.upsertIngredient(ingredient.ingredient),
        })),
      );
    }
    if (updateRecipeDto.tags) {
      tags = await this.upsertTags(updateRecipeDto.tags);
    }

    return this.RecipeModel.findByIdAndUpdate(
      id,
      {
        ...updateRecipeDto,
        tags,
        ingredients,
      },
      { set: true, returnNewDocument: true },
    );
  }

  async remove(id: string, creator: string) {
    // tags and ingredients aren't removed.
    // optimally I'll create a scheduled task to find tags and ingredients that are not used in any recipe or prefered by any user and delete them once a week/month etc...
    const deletedEntity = await this.RecipeModel.findOneAndDelete({
      _id: id,
      creator,
    }); // if the id and the creator aren't aligned- we'll get an exeption
    if (!deletedEntity) {
      throw new NotFoundException('Recipe not found');
    }

    return deletedEntity;
  }
}
