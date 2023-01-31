import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationsParamsPipe } from '../common/custom-pipes/validations-params.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(dto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAllCategories();
  }

  @Get('/:name')
  async findByName(@Param('name') name: string): Promise<Category> {
    return this.categoriesService.findCategoryByName(name);
  }

  @Put('/:name')
  @UsePipes(ValidationPipe)
  async updateByName(
    @Param('name', ValidationsParamsPipe) name: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateOneCategory(name, dto);
  }

  @Post('/:name/player/:id')
  async assignPlayerToCategory(@Param() params: string[]): Promise<void> {
    await this.categoriesService.assignPlayerToCategory(params);
  }
}
