import { ConflictException, Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  // ValidationArguments,
} from 'class-validator'
import { UsersService } from '@/users/users.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userService.findOneByEmail(email)

    if (user) throw new ConflictException(`Email ${email} already exists`)

    return !user // Return true if email not found
  }

  // defaultMessage(args: ValidationArguments): string {
  //   return `Email ${args.value} already exists`
  // }
}
