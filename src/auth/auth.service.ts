import { genSalt, hash, compare } from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { modelNames } from '../configs/model-names.config';
import { UserModel } from './user.model';
import { AuthDto } from './dto/auth.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constraints';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(modelNames.user) private readonly userModel: Model<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(12);
		const passwordHash = await hash(dto.password, salt);

		const newUser = new this.userModel({
			email: dto.login,
			passwordHash,
		});

		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const userExists = await this.findUser(email);
		if (!userExists) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}

		const isCorrectPassword = await compare(password, userExists.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD);
		}

		return {
			email: userExists.email,
		};
	}

	async login(email: string) {
		const payload = { email };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
