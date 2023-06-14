import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Observable } from 'rxjs';

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
    return this.clientAdminBackend.send('get-categories', '');
  }
}
