import mongoose from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { modelNames } from '../configs/model-names.config';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	const exec = { exec: jest.fn() };

	const reviewRepostoryFactory = () => ({
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{ useFactory: reviewRepostoryFactory, provide: getModelToken(modelNames.review) },
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('findByProductId works', async () => {
		const id = new mongoose.Types.ObjectId().toHexString();

		reviewRepostoryFactory()
			.find()
			.exec.mockReturnValueOnce([{ productId: id }]);

		const res = await service.findByProductId(id);

		expect(res[0].productId).toEqual;
	});
});
