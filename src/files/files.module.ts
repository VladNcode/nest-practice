import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { join } from 'path';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			// rootPath: join(__dirname, '..', 'uploads'),
			rootPath: join(path, 'uploads'),
			exclude: ['/api*'],
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
