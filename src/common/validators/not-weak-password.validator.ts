import { BadRequestException } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'NotCommonPassword', async: false })
export class NotWeakPasswordValidator implements ValidatorConstraintInterface {
  private commonPasswords = [
    'Password1!',
    'Qwerty123!',
    'Welcome123$',
    'Admin@123',
    'Abc123!@#',
    'P@ssw0rd',
    'Monkey123!',
    '1Qaz@wsx',
    'Password@1',
    'Test1234!',
    'Pa$$word1',
    'Hello123$',
    'Qwerty1@',
    'Summer2021!',
    'Winter#2023',
    'ChangeMe1!',
    'Spring2022$',
    'Autumn2020#',
    'Happy2022@',
    'Superman1!',
  ]

  validate(password: string): boolean {
    const weakPassword = this.commonPasswords.includes(password)

    if (weakPassword)
      throw new BadRequestException(
        'The password is too weak. Please choose a stronger password.',
      )

    return !weakPassword
  }
}
