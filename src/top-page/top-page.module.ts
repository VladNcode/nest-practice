import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TopPageController } from './top-page.controller';

@Module({
	controllers: [TopPageController],
	imports: [ConfigModule],
})
export class TopPageModule {}
