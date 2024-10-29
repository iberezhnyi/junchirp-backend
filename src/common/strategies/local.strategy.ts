import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import * as bcrypt from 'bcrypt'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const user = await this.usersService.findOneByEmail(email)

    if (user === null) {
      throw new UnauthorizedException('Invalid email or password!')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid === false) {
      throw new UnauthorizedException('Invalid email or password!')
    }

    return user
  }
}
