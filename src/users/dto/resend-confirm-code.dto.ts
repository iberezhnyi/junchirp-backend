import { PickType } from '@nestjs/swagger'
import { VerifyEmailDto } from '@/users/dto'

export class ResendConfirmCodeDto extends PickType(VerifyEmailDto, ['email']) {}
