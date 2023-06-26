import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './enum/challenge-status.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.requestDateTime = new Date();
      /*
                When a challenge is created, we set its status to PENDING
            */
      createdChallenge.status = ChallengeStatus.PENDING;
      this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);
      return await createdChallenge.save();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getPlayerChallenges(_id: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallengeById(_id: any): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
    try {
      /*
                We will update the response date when the challenge status is filled
            */
      challenge.responseDateTime = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    matchId: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      /*
                When a match is registered by a user, we change the challenge status to COMPLETED
            */
      challenge.status = ChallengeStatus.COMPLETED;
      challenge.match = matchId;
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;
      /*
                We will perform a logical deletion of the challenge by changing its status to CANCELED
            */
      challenge.status = ChallengeStatus.CANCELED;
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error: any) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
