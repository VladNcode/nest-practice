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

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.find({ firstLevelCategory: firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
			.exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: TopPageModelDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
