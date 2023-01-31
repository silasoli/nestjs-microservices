import { Document } from 'mongoose';

export interface Event extends Document {
  name: string;
  operation: string;
  value: number;
}
