import { Controller, Get, Header, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from '../top-page/top-page.service';
import { addDays, formatISO } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constraints';

@Controller('sitemap')
export class SitemapController {
	domain: string;
	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService,
	) {
		this.domain = this.configService.get('DOMAIN') ?? 'http://hello.com';
	}

	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap(@Headers('host') host: string) {
		this.domain = this.configService.get('DOMAIN') ?? `http://${host}`;

		let res = [
			{
				loc: this.domain,
				lastmod: formatISO(addDays(new Date(), -1)),
				changefreq: 'daily',
				priority: '1.0',
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: formatISO(addDays(new Date(), -1)),
				changefreq: 'daily',
				priority: '1.0',
			},
		];

		const pages = await this.topPageService.findAll();

		res = res.concat(
			pages.map(page => {
				return {
					loc: `${this.domain}${CATEGORY_URL[page.firstLevelCategory]}/${page.alias}`,
					lastmod: formatISO(page.updatedAt ?? new Date()),
					changefreq: 'weekly',
					priority: '0.7',
				};
			}),
		);

		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});

		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
				url: res,
			},
		});
	}
}
