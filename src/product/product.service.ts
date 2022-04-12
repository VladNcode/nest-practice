import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { modelNames } from '../configs/model-names.config';
import { ProductModel } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewDocument } from '../review/review.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(modelNames.product) private readonly productModel: Model<ProductModel>,
	) {}

	async create(dto: CreateProductDto): Promise<ProductModel> {
		return this.productModel.create(dto);
	}

	async findById(id: string): Promise<ProductModel | null> {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string): Promise<ProductModel | null> {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto): Promise<ProductModel | null> {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					$match: {
						categories: dto.category,
					},
				},
				{
					$sort: { _id: 1 },
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						from: 'reviews',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
						reviews: {
							$function: {
								body: function (reviews: ReviewDocument[]) {
									reviews.sort(
										(a, b) =>
											new Date(b.createdAt as Date).valueOf() -
											new Date(a.createdAt as Date).valueOf(),
									);
									return reviews;
								},
								args: ['$reviews'],
								lang: 'js',
							},
						},
					},
				},
			])
			.exec() as Promise<
			(ProductModel & {
				review: ReviewDocument[];
				reviewCount: number;
				reviewAvg: number;
			})[]
		>;
	}
}
