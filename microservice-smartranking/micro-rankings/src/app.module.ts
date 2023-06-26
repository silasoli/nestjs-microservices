import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    RankingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://admin_sr:kdWcpu1jWvUSlU6Y@clustermogodb-79l5n.mongodb.net/srranking?retryWrites=true&w=majority',
    ),
    ProxyRMQModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
