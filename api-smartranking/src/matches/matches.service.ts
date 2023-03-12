import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './interfaces/match.interface';
import * as mongodb from 'mongodb';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  public async create(dto: CreateMatchDto): Promise<Match> {
    return this.matchModel.create(dto);
  }

  public async findAll(): Promise<Match[]> {
    return this.matchModel.find();
  }

  public async findOne(_id: string): Promise<Match> {
    return this.matchModel.findOne({ _id });
  }

  public async remove(_id: string): Promise<mongodb.DeleteResult> {
    return this.matchModel.deleteOne({ _id });
  }
}
