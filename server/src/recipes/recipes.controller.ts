import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('api/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.recipesService.create({
      ...createRecipeDto,
      image: file.path,
      creator: req.user._id,
    });
  }

  @Get()
  findAll(@Query('tags') tags?: string[]) {
    return this.recipesService.findAll(tags);
  }

  @Get('reccommended')
  @UseGuards(new JwtAuthGuard(false))
  findRecommended(@Req() req) {
    return this.recipesService.findRecommended(
      req.user?.preferedTags,
      req.user?.maxPreferedPreperationTimeMinutes,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.recipesService.update(id, {
      ...updateRecipeDto,
      image: file?.path,
      creator: req.user._id,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.recipesService.remove(id, req.user._id);
  }
}
