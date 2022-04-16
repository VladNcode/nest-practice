import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { HhModule } from '../hh/hh.module';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
	controllers: [TopPageController],
	imports: [
		MongooseModule.forFeature([{ schema: TopPageSchema, name: modelNames.topPage }]),
		HhModule,
	],
	providers: [TopPageService],
	exports: [TopPageService],
})
export class TopPageModule {}
