import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  // ValidationArguments,
} from 'class-validator'
import { ConflictException, Injectable } from '@nestjs/common'
import { UsersService } from '@/users/users.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    console.log('email in IsEmailUnique :>> ', email)

    const user = await this.userService.findByEmail(email)

    if (user) throw new ConflictException(`Email ${email} already exists`)

    return !user // Возвращаем true, если email не найден
  }

  // defaultMessage(args: ValidationArguments): string {
  //   return `Email ${args.value} already exists`
  // }
}
