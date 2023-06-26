import { Document } from 'mongoose';
import { Category } from '../../categories/interfaces/category.interface';

export interface Player extends Document {
  phone: string;
  email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  imageUrl: string;
  category: Category;
}
