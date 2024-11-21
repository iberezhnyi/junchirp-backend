import { PickType } from '@nestjs/swagger'
import { LoginUserDto } from '@/auth/dto'

export class RequestConfirmCodeDto extends PickType(LoginUserDto, ['email']) {}
