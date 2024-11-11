import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Express } from 'express'

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize = 2 * 1024 * 1024 // 2 MB
  private readonly allowedFormats = ['image/jpg', 'image/jpeg', 'image/png']

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) throw new BadRequestException('File is required')

    if (!this.allowedFormats.includes(file.mimetype))
      throw new BadRequestException('Invalid file format')

    if (file.size > this.maxSize)
      throw new BadRequestException('File size exceeds 2 MB limit')

    return file
  }
}
