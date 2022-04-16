import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { HhData, HhResponse } from './hh.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HhService {
	constructor(private readonly httpService: HttpService) {}

	async getData(text: string) {
		try {
			const { data } = await firstValueFrom(
				this.httpService.get<HhResponse>('https://jsonplaceholder.typicode.com/todos/1'),
			);

			return this.parseData(data);
		} catch (error) {
			Logger.error(error);
		}
	}

	private parseData(res: HhResponse): HhData {
		const data = {
			userId: res.userId,
			title: res.title,
			completed: res.completed,
		};

		return data;
	}
}
