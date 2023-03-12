import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from '../players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  private async validateCreation(dto: CreateCategoryDto): Promise<void> {
    const { category } = dto;

    const registred = await this.categoryModel.findOne({
      [`${category}`]: { $regex: `${category}`, $options: 'i' },
    });

    if (registred)
      throw new BadRequestException(`Category: ${category} already registered`);
  }

  public async findCategoryByPlayer(player: string): Promise<Category> {
    const existsCategory = await this.categoryModel.findOne({
      players: { $in: [player] },
    });

    if (!existsCategory)
      throw new BadRequestException(
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

  public async findCategoryById(_id: string): Promise<Category> {
    const existsCategory = await this.categoryModel.findOne({ _id });

    if (!existsCategory)
      throw new NotFoundException(`Category with ID ${_id} not found`);

    return existsCategory;
  }

  public async updateOneCategory(
    _id: string,
    dto: UpdateCategoryDto,
  ): Promise<void> {
    await this.findCategoryById(_id);
    await this.categoryModel.updateOne({ _id }, dto);
  }

  public async verifyPlayerToAssing(
    categoryId: string,
    playerId: string,
  ): Promise<void> {
    const existsPlayerInCategory = await this.categoryModel.find({
      _id: categoryId,
      players: { $in: [playerId] },
    });

    if (existsPlayerInCategory)
      throw new BadRequestException(`Player already registered in category`);
  }

  public async assignPlayerToCategory(
    categoryId: string,
    playerId: string,
  ): Promise<void> {
    const existsCategory = await this.findCategoryById(categoryId);
    const player = await this.playersService.findPlayerById(playerId);
    await this.verifyPlayerToAssing(categoryId, playerId);

    existsCategory.players.push(player);

    await this.categoryModel.updateOne({ _id: categoryId }, existsCategory);
  }
}
