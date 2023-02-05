import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchSchema } from './schemas/match.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  controllers: [],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
