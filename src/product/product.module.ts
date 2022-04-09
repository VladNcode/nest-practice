import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaNames } from 'src/configs/schema-names.config';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.model';

@Module({
	controllers: [ProductController],
	imports: [MongooseModule.forFeature([{ schema: ProductSchema, name: schemaNames.product }])],
})
export class ProductModule {}
