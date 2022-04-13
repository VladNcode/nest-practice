import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongoExceptionsFilter implements ExceptionFilter {
	catch(exp: any, host: ArgumentsHost) {
		// console.log(exp);

		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		// const request = context.getRequest<Request>();
		// const validErrors = hasKey && Array.isArray(exp.response.message) ? exp.response.message : [];
		// const type = hasKey && exp.response.type ? exp.response.type : 'some_thing_went_error';

		const hasKey = Object.keys(exp).length > 0 && exp.hasOwnProperty('response') ? true : false;
		const isHttpInstance = exp instanceof HttpException ? true : false;
		const error = hasKey ? exp.response.error : exp;
		let statusCode = isHttpInstance ? exp.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		let message = isHttpInstance ? exp.message : 'Oops Something went wrong!';
		let res;

		switch (exp.name) {
			case 'DocumentNotFoundError': {
				res = {
					statusCode,
					error,
					message,
				};

				response.status(statusCode).json(res);
				break;
			}
			case 'MongoServerError': {
				statusCode = HttpStatus.BAD_REQUEST;
				const duplField = error.keyValue;
				message = `Duplicate values in fields: ${JSON.stringify(duplField)
					.replace(/"/g, '')
					.replace(/{/g, '{ ')
					.replace(/}/g, ' }')
					.replace(/:/g, ': ')
					.replace(/,/g, ', ')}`;

				res = {
					statusCode,
					message,
				};

				response.status(statusCode).json(res);
				break;
			}
			case 'CastError': {
				const id = (error.message.match(/"(\w*)"/) as string[])[1];
				statusCode = HttpStatus.NOT_FOUND;

				res = {
					statusCode,
					message: `Invalid ObjectId: ${id}`,
				};

				response.status(statusCode).json(res);
				break;
			}
			// case 'MongooseError': { break; } // general Mongoose error
			// case 'DisconnectedError': { break; }
			// case 'DivergentArrayError': { break; }
			// case 'MissingSchemaError': { break; }
			// case 'ValidatorError': { break; }
			// case 'ValidationError': { break; }
			// case 'ObjectExpectedError': { break; }
			// case 'ObjectParameterError': { break; }
			// case 'OverwriteModelError': { break; }
			// case 'ParallelSaveError': { break; }
			// case 'StrictModeError': { break; }
			// case 'VersionError': { break; }
			default: {
				res = {
					statusCode,
					error,
					message,
				};

				response.status(statusCode).json(res);
				break;
			}
		}
	}
}

// response.status(statusCode).json({
// 	message,
// 	type,
// 	validationErrors: validErrors,
// 	statusCode,
// 	error,
// 	timestamp: new Date().toISOString(),
// 	path: request.url,
// });
