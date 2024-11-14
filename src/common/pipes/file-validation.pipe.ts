import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Express } from 'express'
import { UPLOAD_CONSTANTS } from '@/common/configs/upload'

@Injectable()
export class FileValidationPipe implements PipeTransform {
  // private readonly maxSize = 2 * 1024 * 1024 // 2 MB
  private readonly maxSize = UPLOAD_CONSTANTS.AVATAR_MAX_FILE_SIZE
  private readonly allowedFormats = UPLOAD_CONSTANTS.AVATAR_ALLOWED_FORMATS

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) throw new BadRequestException('File is required')

    if (!this.allowedFormats.includes(file.mimetype))
      throw new BadRequestException('Invalid file format')

    if (file.size > this.maxSize)
      throw new BadRequestException('File size exceeds 2 MB limit')

    return file
  }
}
