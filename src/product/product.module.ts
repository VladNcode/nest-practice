import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.model';
import { ProductService } from './product.service';

@Module({
	controllers: [ProductController],
	imports: [MongooseModule.forFeature([{ schema: ProductSchema, name: modelNames.product }])],
	providers: [ProductService],
})
export class ProductModule {}
