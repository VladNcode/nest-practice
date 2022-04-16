import { HhService } from './hh.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [HhService],
	exports: [HhService],
})
export class HhModule {}
