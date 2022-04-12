import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constraints';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login/')
			.send({ login: 'test@test.com', password: 'password' })
			.expect(200);

		expect(body.access_token).toBeTruthy();
	});

	it('/auth/login (POST) - fail wrong login', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login/')
			.send({ login: 'test@test.comm', password: 'password' })
			.expect(401);

		expect(body.message).toEqual(USER_NOT_FOUND);
	});

	it('/auth/login (POST) - fail wrong password', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login/')
			.send({ login: 'test@test.com', password: 'passwordd' })
			.expect(401);

		expect(body.message).toEqual(WRONG_PASSWORD);
	});

	afterAll(() => {
		mongoose.disconnect();
	});
});
