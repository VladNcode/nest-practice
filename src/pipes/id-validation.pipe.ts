import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ID_VALIDATION_ERROR } from './id-validation.constraints';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') {
			return value;
		}

		if (!ObjectId.isValid(value)) {
			throw new BadRequestException(ID_VALIDATION_ERROR);
		}

		return value;
	}
}
