import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { PlayerSchema } from './schemas/player.schema';
import { CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URI_MICROADMIN),
    MongooseModule.forFeature([
      { name: 'Player', schema: PlayerSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
