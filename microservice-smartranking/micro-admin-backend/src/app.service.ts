import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { Player } from './interfaces/player.interface';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private async validateCreation(dto: CreateCategoryDto): Promise<void> {
    const { category } = dto;

    const registred = await this.categoryModel.findOne({
      [`${category}`]: { $regex: `${category}`, $options: 'i' },
    });

    if (registred)
      throw new RpcException(`Category: ${category} already registered`);
  }

  public async findCategoryByPlayer(player: string): Promise<Category> {
    const existsCategory = await this.categoryModel.findOne({
      players: { $in: [player] },
    });

    if (!existsCategory)
      throw new RpcException(
        `Player with id ${player} does not belong to any category.`,
      );

    return existsCategory;
  }

  public async createCategory(dto: CreateCategoryDto): Promise<Category> {
    await this.validateCreation(dto);

    return this.categoryModel.create(dto);
  }

  public async findAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().populate('players');
  }
}
