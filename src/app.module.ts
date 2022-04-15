import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `${process.env.NODE_ENV === 'dev' ? '.development.env' : '.env'}`,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		TelegramModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		SitemapModule,
		TelegramModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
