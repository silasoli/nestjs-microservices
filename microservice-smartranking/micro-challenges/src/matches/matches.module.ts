import { Module } from '@nestjs/common';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchSchema } from './schemas/match.schema';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
    ProxyRMQModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
