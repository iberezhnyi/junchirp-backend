import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserModel } from 'src/users/schemas'
import { normalizedEmailAndFindUser } from 'src/common/helpers'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const { user } = await normalizedEmailAndFindUser({
      email,
      userModel: this.userModel,
    })

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
