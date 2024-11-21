import { ApiProperty, PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { LoginUserDto } from '@/auth/dto'

export class VerifyEmailDto extends PickType(LoginUserDto, ['email']) {
  @ApiProperty({
    example: '123456',
    description: "Confirmation code sent to user's email",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  @Transform(({ value }) => value.trim())
  code: number
}
