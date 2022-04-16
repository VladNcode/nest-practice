import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { HhService } from '../hh/hh.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TopPageModelDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constraints';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: TopPageModelDto) {
		return await this.topPageService.create(dto);
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const topPage = await this.topPageService.findByAlias(alias);

		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return topPage;
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return await this.topPageService.findByText(text);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getById(@Param('id') id: string) {
		const topPage = await this.topPageService.findById(id);

		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return topPage;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: TopPageModel) {
		const updatedTopPage = await this.topPageService.updateById(id, dto);

		if (!updatedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}

		return updatedTopPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedTopPage = await this.topPageService.deleteById(id);

		if (!deletedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND);
		}
	}

	@Cron(CronExpression.EVERY_WEEK)
	@Post('test')
	async test() {
		const data = await this.topPageService.findForHhUpdate(new Date());

		const sleep = function (seconds: number) {
			return new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, seconds * 1000);
			});
		};

		for (const page of data) {
			const hhData = await this.hhService.getData(page.category);
			console.log(hhData);
			await sleep(3);
			page.hh = {
				count: 1,
				juniorSalary: hhData?.userId || 500,
				middleSalary: 2000,
				seniorSalary: 5000,
			};
			console.log(page);

			await this.topPageService.updateById(page._id, page);
		}
	}
}
