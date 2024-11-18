import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Express } from 'express'
import { UPLOAD } from '@/common/configs/upload'

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize = UPLOAD.AVATAR_MAX_FILE_SIZE
  private readonly allowedFormats = UPLOAD.AVATAR_ALLOWED_FORMATS

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) throw new BadRequestException('Image is required')

    if (!this.allowedFormats.includes(file.mimetype))
      throw new BadRequestException(
        `Invalid file format. Allowed formats are: ${this.allowedFormats}`,
      )

    if (file.size > this.maxSize)
      throw new BadRequestException(
        `File size exceeds ${this.maxSize / (1024 * 1024)} MB limit`,
      )

    return file
  }
}
