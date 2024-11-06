import { PickType } from '@nestjs/swagger'
import { VerifyEmailDto } from '@/auth/dto'

export class ResendConfirmCodeDto extends PickType(VerifyEmailDto, ['email']) {}
