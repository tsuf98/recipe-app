import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { Tag, TagSchema } from '../tags/schemas/tag.schema';
import { Ingredient, IngredientSchema } from './schemas/ingredient.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import { MAX_IMAGE_FILE_SIZE } from './constants';
import { recipeUploadFileFilter } from './file-filter';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: MAX_IMAGE_FILE_SIZE,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: async (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          cb(null, `${nanoid(12)}${fileExtName}`);
        },
      }),
      fileFilter: recipeUploadFileFilter,
    }),
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: Tag.name, schema: TagSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
