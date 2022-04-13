import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		// const request = ctx.getRequest();

		let error;

		switch (exception.name) {
			case 'DocumentNotFoundError': {
				error = {
					statusCode: HttpStatus.NOT_FOUND,
					error: 'Not Found',
				};

				break;
			}
			case 'MongoServerError': {
				const err = exception.message.match(/{.*}/);

				error = {
					statusCode: HttpStatus.BAD_REQUEST,
					error: `Duplicate key error: ${err}`,
				};
				break;
			}
			// case 'MongooseError': { break; } // general Mongoose error
			case 'CastError': {
				error = {
					statusCode: HttpStatus.BAD_REQUEST,
					error: `${exception.message}`,
				};

				break;
			}
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
				error = {
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'Internal Error',
				};
				break;
			}
		}

		response.status(error.statusCode).json(error);
	}
}
