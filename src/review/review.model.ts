import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { schemaNames } from 'src/configs/schema-names.config';

export type ReviewDocument = ReviewModel & Document;

@Schema({ timestamps: true })
export class ReviewModel {
	@Prop()
	name: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop()
	rating: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: schemaNames.review })
	productId: mongoose.Schema.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
