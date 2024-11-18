import { Express } from 'express'
import { ApiProperty } from '@nestjs/swagger'
import { UPLOAD } from '@/common/configs/upload'

export class UploadAvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: `The avatar image file. Allowed formats: ${UPLOAD.AVATAR_ALLOWED_FORMATS}. Maximum size: ${UPLOAD.AVATAR_MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    example: 'avatar_example.jpg',
  })
  avatar: Express.Multer.File
}
