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

import { CreateCategoryDto } from './dtos/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Controller('/categories')
export class CategoriesController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() dto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', dto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', null);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateCategory(@Param('id') _id: string, @Body() dto: UpdateCategoryDto) {
    this.clientAdminBackend.emit('update-category', { _id, dto });
  }
}
