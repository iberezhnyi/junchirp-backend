import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { BadRequestException } from '@nestjs/common'

@ValidatorConstraint({ name: 'noRuDomain', async: false })
export class NotRuDomainValidator implements ValidatorConstraintInterface {
  validate(email: string): boolean {
    const ruDomain = email.toLowerCase().endsWith('.ru')

    if (ruDomain)
      throw new BadRequestException('Russian warship, go f*ck yourself!')

    return !ruDomain
  }
}
