import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './exception-filters/mongo.exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalFilters(new MongoExceptionFilter());
	await app.listen(3000);
}

bootstrap();
