import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAllowed = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.validateStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }

    return value;
  }

  private validateStatus(status: any) {
    return this.statusAllowed.includes(status);
  }
}
