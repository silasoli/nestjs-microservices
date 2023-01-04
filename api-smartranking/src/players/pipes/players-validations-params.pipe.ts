import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

export class PlayersValidationsParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value)
      throw new BadRequestException(
        `The value of the parameter ${metadata.data} must be informed`,
      );
    return value;
  }
}
