import { BadRequestException } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

interface ValidationObject {
  userName?: string
}

@ValidatorConstraint({ name: 'notContainUserName', async: false })
export class NotContainUserNameValidator
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments): boolean {
    const object = args.object as ValidationObject
    const userName = object.userName?.trim()

    if (!userName) return true

    const normalizedUserName = userName.toLowerCase().replace(/\s+/g, '')
    const normalizedPassword = password.toLowerCase()

    const containUserName = normalizedPassword.includes(normalizedUserName)

    if (containUserName)
      throw new BadRequestException('Password must not contain your username.')

    return !containUserName
  }
}
