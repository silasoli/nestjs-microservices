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
    const existsCategory = await this.categoryModel.findOne({
      category: dto.category,
    });

    if (existsCategory)
      throw new BadRequestException(
        `Category: ${dto.category} already registered`,
      );

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

  public async findCategoryByName(name: string): Promise<Category> {
    const existsCategory = await this.categoryModel.findOne({ category: name });

    if (!existsCategory)
      throw new NotFoundException(`Category ${name} not found`);

    return existsCategory;
  }

  public async updateOneCategory(
    name: string,
    dto: UpdateCategoryDto,
  ): Promise<void> {
    await this.findCategoryByName(name);

    await this.categoryModel.findOneAndUpdate(
      { category: name },
      { $set: dto },
    );
  }

  public async verifyPlayerToAssing(
    playerId: string,
    category: string,
  ): Promise<void> {
    await this.playersService.findPlayerById(playerId);

    const existsPlayerInCategory = await this.categoryModel.find({
      category,
      players: { $in: [playerId] },
    });

    if (existsPlayerInCategory)
      throw new BadRequestException(
        `Player already registered in category: ${category}`,
      );
  }

  public async assignPlayerToCategory(params: string[]): Promise<void> {
    const { name, id }: any = params;

    await this.verifyPlayerToAssing(id, name);
    const existsCategory = await this.findCategoryByName(name);

    existsCategory.players.push(id);

    await this.categoryModel.findOneAndUpdate(
      { category: name },
      { $set: existsCategory },
    );
  }
}
