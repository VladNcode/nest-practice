import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constraints';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		await this.notify(dto);
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message =
			`Name: ${dto.name}\n` +
			`Title: ${dto.title}\n` +
			`Description: ${dto.description}\n` +
			`Rating: ${dto.rating}\n` +
			`Product ID: ${dto.productId}`;

		return this.telegramService.sendMessage(message);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
		@UserEmail() email: string,
	) {
		console.log(email);
		return this.reviewService.findByProductId(productId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('byProduct/:productId')
	async deleteByProductId(@Param('productId', IdValidationPipe) productId: string) {
		const deletedReviews = await this.reviewService.deleteByProductId(productId);
		if (deletedReviews.deletedCount === 0) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
}
