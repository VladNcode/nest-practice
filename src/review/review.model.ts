import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { modelNames } from '../configs/model-names.config';

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

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: modelNames.review })
	productId: mongoose.Schema.Types.ObjectId;

	@Prop(() => Date)
	createdAt?: Date;

	@Prop(() => Date)
	updatedAt?: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
