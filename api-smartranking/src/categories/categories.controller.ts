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
import { ApiTags } from '@nestjs/swagger';
import { ValidationsParamsPipe } from '../common/custom-pipes/validations-params.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@ApiTags('Categories')
@Controller('categories')
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

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findCategoryById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateOne(
    @Param('id', ValidationsParamsPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateOneCategory(id, dto);
  }

  @Post('/:id/player/:player')
  async assignPlayerToCategory(
    @Param('id') id: string,
    @Param('player') player: string,
  ): Promise<void> {
    await this.categoriesService.assignPlayerToCategory(id, player);
  }
}
