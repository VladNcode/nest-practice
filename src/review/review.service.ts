import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, ReviewModel } from './review.model';
import { modelNames } from '../configs/model-names.config';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteResult } from 'mongodb';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(modelNames.review) private readonly reviewModel: Model<ReviewDocument>,
	) {}

	async create(dto: CreateReviewDto): Promise<ReviewModel> {
		return this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<ReviewModel | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<ReviewModel[]> {
		return this.reviewModel.find({ productId }).exec();
	}

	async deleteByProductId(productId: string): Promise<DeleteResult> {
		return this.reviewModel.deleteMany({ productId }).exec();
	}
}
