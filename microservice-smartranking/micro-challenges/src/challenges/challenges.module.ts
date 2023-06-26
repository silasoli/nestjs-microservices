import { ChallengeSchema } from './schemas/challenge.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
