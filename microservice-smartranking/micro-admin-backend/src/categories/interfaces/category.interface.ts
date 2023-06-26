import { Document } from 'mongoose';

export interface Category extends Document {
  category: string;
  description: string;
  events: Array<Event>;
}

export interface Event extends Document {
  name: string;
  operation: string;
  value: number;
}
