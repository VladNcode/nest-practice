import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
	controllers: [TopPageController],
	imports: [
		ConfigModule,
		MongooseModule.forFeature([{ schema: TopPageSchema, name: modelNames.topPage }]),
	],
	providers: [TopPageService],
})
export class TopPageModule {}
