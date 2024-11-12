import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Express } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { ConfigService } from '@/common/configs/config.service'
import { v4 as uuidv4 } from 'uuid'
import { UploadApiOptions, UploadApiResponse } from 'cloudinary'

interface CloudinaryService {
  uploader: {
    upload(path: string, options?: UploadApiOptions): Promise<UploadApiResponse>
  }
}

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('Cloudinary') private readonly cloudinaryService: CloudinaryService,
  ) {}

  async saveFile({
    file,
    userId,
  }: {
    file: Express.Multer.File
    userId: string
  }): Promise<string> {
    const uniqueFileName = `${userId}_${uuidv4()}`
    const tempDir = this.configService.tempFolderPath
    const tempFilePath = path.join(tempDir, uniqueFileName)

    fs.writeFileSync(tempFilePath, file.buffer)

    try {
      // Загружаем файл в Cloudinary
      const result: UploadApiResponse =
        await this.cloudinaryService.uploader.upload(tempFilePath, {
          folder: 'avatars/users',
          public_id: uniqueFileName,
        })

      // Удаляем временный файл после успешной загрузки
      // fs.unlinkSync(tempFilePath)

      // Возвращаем URL загруженного файла
      return result.secure_url
    } catch (error) {
      fs.unlinkSync(tempFilePath)
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`)
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.configService.uploadFolderPath, fileName)

    if (!fs.existsSync(filePath)) throw new NotFoundException('File not found')

    fs.unlinkSync(filePath)
  }
}
