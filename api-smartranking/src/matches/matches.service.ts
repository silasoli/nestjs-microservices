import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  public async create(dto: CreateMatchDto) {
    return this.matchModel.create(dto);
  }

  public async findAll() {
    return this.matchModel.find();
  }

  public async findOne(_id: string) {
    return this.matchModel.find({ _id });
  }

  public async remove(_id: string): Promise<any> {
    return this.matchModel.deleteOne({ _id });
  }
}
