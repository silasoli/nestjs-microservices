import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';
import { RankingsService } from './rankings.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  private readonly logger = new Logger(RankingsController.name);

  @EventPattern('process-match')
  async processMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const matchId: string = data.matchId;
      const match: Match = data.match;

      await this.rankingsService.processMatch(matchId, match);
      await channel.ack(originalMsg);
    } catch (error) {
      const filteredAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filteredAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-rankings')
  async getRankings(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { categoryId, dateRef } = data;

      return await this.rankingsService.getRankings(categoryId, dateRef);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
