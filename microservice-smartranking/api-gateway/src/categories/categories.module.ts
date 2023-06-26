import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
