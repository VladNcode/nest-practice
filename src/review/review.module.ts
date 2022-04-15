import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { TelegramModule } from '../telegram/telegram.module';
import { ReviewController } from './review.controller';
import { ReviewSchema } from './review.model';
import { ReviewService } from './review.service';

@Module({
	controllers: [ReviewController],
	imports: [
		MongooseModule.forFeature([{ schema: ReviewSchema, name: modelNames.review }]),
		TelegramModule,
	],
	providers: [ReviewService],
})
export class ReviewModule {}
