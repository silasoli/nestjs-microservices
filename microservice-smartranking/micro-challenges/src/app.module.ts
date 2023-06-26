import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin_sr:kdWcpu1jWvUSlU6Y@clustermogodb-79l5n.mongodb.net/srdesafios?retryWrites=true&w=majority',
    ),
    ProxyRMQModule,
    ChallengesModule,
    MatchesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
