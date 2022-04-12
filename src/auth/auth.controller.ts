import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { USER_ALREADY_EXIST } from './auth.constraints';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const existingUser = await this.authService.findUser(dto.login);
		if (existingUser) {
			throw new BadRequestException(USER_ALREADY_EXIST);
		}

		const user = await this.authService.createUser(dto);
		return { status: 'success', data: { user: user.email } };
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		const user = await this.authService.validateUser(login, password);
		return this.authService.login(user.email);
	}
}
