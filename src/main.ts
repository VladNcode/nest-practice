import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoExceptionsFilter } from './exception-filters/mongo.exception.filter';

export let app: INestApplication;

async function bootstrap() {
	app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalFilters(new MongoExceptionsFilter());
	await app.listen(3000);
}

bootstrap();
