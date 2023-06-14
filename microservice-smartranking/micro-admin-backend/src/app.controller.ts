import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger('Main');

  @EventPattern('create-category')
  async createCategory(@Payload() dto: CreateCategoryDto) {
    this.logger.log(`category: ${dto}`);

    await this.appService.createCategory(dto);
  }

  @MessagePattern('get-categories')
  async getCategories() {
    await this.appService.findAllCategories();
  }
}
