import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { modelNames } from '../configs/model-names.config';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModelDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(modelNames.topPage) private readonly topPageModel: Model<TopPageModel>,
	) {}

	async create(dto: TopPageModelDto) {
		return this.topPageModel.create(dto);
	}

	async findAll() {
		return this.topPageModel.find({}).exec();
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate()
			.match({ firstLevelCategory: firstCategory })
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } },
			})
			.exec();

		// return this.topPageModel
		// 	.aggregate([
		// 		{
		// 			$match: {
		// 				firstLevelCategory: firstCategory,
		// 			},
		// 		},
		// 		{
		// 			$group: {
		// 				_id: {
		// 					secondCategory: '$secondCategory',
		// 				},
		// 				pages: {
		// 					$push: { alias: '$alias', title: '$title' },
		// 				},
		// 			},
		// 		},
		// 	])
		// 	.exec();
	}

	async findByText(text: string) {
		return this.topPageModel
			.find({
				$text: {
					$search: text,
					$caseSensitive: false,
				},
			})
			.exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: TopPageModelDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
