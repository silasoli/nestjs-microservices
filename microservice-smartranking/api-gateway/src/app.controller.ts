import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './categories/dtos/update-category.dto';
import { CreateCategoryDto } from './categories/dtos/create-category.dto';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp//user:password@18.210.17.173:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() dto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', dto);
  }

  @Get('categories')
  @UsePipes(ValidationPipe)
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', null);
  }

  @Put('categories/:id')
  @UsePipes(ValidationPipe)
  updateCategory(@Param('id') _id: string, @Body() dto: UpdateCategoryDto) {
    this.clientAdminBackend.emit('update-category', { _id, dto });
  }
}
