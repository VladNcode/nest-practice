import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaNames } from '../configs/schema-names.config';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.model';

@Module({
	controllers: [AuthController],
	imports: [MongooseModule.forFeature([{ schema: AuthSchema, name: schemaNames.auth }])],
})
export class AuthModule {}
