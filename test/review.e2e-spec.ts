import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constraints';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';

const productId = new mongoose.Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	name: 'Test',
	title: 'Title',
	description: 'Desc',
	rating: 5,
	productId,
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/review/create (POST) - fail', async () => {
		const {
			body: { message },
		} = await request(app.getHttpServer())
			.post('/review/create')
			.send({
				...testDto,
				description: 5,
				rating: 6,
			})
			.expect(400);

		expect(message).toMatchObject([
			'description must be a string',
			'rating must not be greater than 5',
		]);
	});

	it('/review/create (POST) - success', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201);

		createdId = body._id;
		expect(createdId).toBeDefined();
	});

	it('/review/byProduct/:productId (GET) - success', async () => {
		const { body } = await request(app.getHttpServer())
			.get(`/review/byProduct/${productId}`)
			.expect(200);

		expect(body[0]._id).toEqual(createdId);
	});

	it('/review/byProduct/:productId (GET) - fail', async () => {
		const { body } = await request(app.getHttpServer())
			.get(`/review/byProduct/${new mongoose.Types.ObjectId().toHexString()}`)
			.expect(200);

		expect(body.length).toEqual(0);
	});

	it('/review/byProduct/:productId (DELETE) - success', async () => {
		await request(app.getHttpServer()).delete(`/review/byProduct/${productId}`).expect(200);
	});

	it('/review/byProduct/:productId (DELETE) - fail', async () => {
		const {
			body: { message },
		} = await request(app.getHttpServer())
			.delete(`/review/byProduct/${new mongoose.Types.ObjectId().toHexString()}`)
			.expect(404);

		expect(message).toEqual(REVIEW_NOT_FOUND);
	});

	it('/review/:id (DELETE) - success', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201);

		createdId = body._id;
		await request(app.getHttpServer()).delete(`/review/${createdId}`).expect(200);
	});

	it('/review/:id (DELETE) - fail', async () => {
		const {
			body: { message },
		} = await request(app.getHttpServer())
			.delete(`/review/${new mongoose.Types.ObjectId().toHexString()}`)
			.expect(404);

		expect(message).toEqual(REVIEW_NOT_FOUND);
	});

	afterAll(() => {
		mongoose.disconnect();
	});
});
