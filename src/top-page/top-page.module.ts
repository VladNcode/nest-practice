import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaNames } from 'src/configs/schema-names.config';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model';

@Module({
	controllers: [TopPageController],
	imports: [
		ConfigModule,
		MongooseModule.forFeature([{ schema: TopPageSchema, name: schemaNames.topPage }]),
	],
})
export class TopPageModule {}
