import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaNames } from 'src/configs/schema-names.config';
import { ReviewController } from './review.controller';
import { ReviewSchema } from './review.model';
import { ReviewService } from './review.service';

@Module({
	controllers: [ReviewController],
	imports: [MongooseModule.forFeature([{ schema: ReviewSchema, name: schemaNames.review }])],
	providers: [ReviewService],
})
export class ReviewModule {}
