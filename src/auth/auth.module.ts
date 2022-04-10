import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.model';

@Module({
	controllers: [AuthController],
	imports: [MongooseModule.forFeature([{ schema: AuthSchema, name: modelNames.auth }])],
})
export class AuthModule {}
