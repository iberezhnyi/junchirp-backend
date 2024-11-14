import { Inject, Injectable } from '@nestjs/common'
import { Express } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { ConfigService } from '@/common/configs/config.service'
import { v4 as uuidv4 } from 'uuid'
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { UPLOAD_CONSTANTS, getCloudinaryOptions } from '@/common/configs/upload'

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

@Injectable()
export class UploadService {
  private readonly tempDir = this.configService.tempFolderPath

  constructor(
    private readonly configService: ConfigService,
    @Inject('CLOUDINARY')
    private readonly cloudinary: CloudinaryResponse,
  ) {}

  async saveFile({
    file,
    userId,
    publicId,
    folder,
  }: {
    file: Express.Multer.File | string
    userId?: string
    publicId?: string
    folder: string
  }): Promise<string> {
    const uniquePublicId = publicId ?? `${userId}_${uuidv4()}`

    const tempFilePath = path.join(this.tempDir, uniquePublicId)

    if (typeof file === 'string') {
      // Если file — это путь к файлу (используется для дефолтного аватара)
      fs.copyFileSync(file, tempFilePath)
    } else {
      // Если file — это объект Express.Multer.File (загружаемый пользователем файл)
      fs.writeFileSync(tempFilePath, file.buffer)
    }

    const options = getCloudinaryOptions({ publicId: uniquePublicId, folder })

    try {
      // Загружаем файл в Cloudinary
      const result: UploadApiResponse = await this.cloudinary.uploader.upload(
        tempFilePath,
        options,
      )

      // Удаляем временный файл после успешной загрузки
      fs.unlinkSync(tempFilePath)

      // Возвращаем URL загруженного файла
      return result.secure_url
    } catch (error) {
      fs.unlinkSync(tempFilePath)
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    const publicIdWithPath = UPLOAD_CONSTANTS.AVATAR_UPLOAD_FOLDER + publicId

    try {
      const result = await this.cloudinary.uploader.destroy(publicIdWithPath)

      if (result.result !== 'ok') {
        throw new Error('Failed to delete file')
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  extractPublicId(url: string): string {
    const parts = url.split('/')
    return parts[parts.length - 1].split('.')[0]
  }

  async fileExistsOnCloudinary(publicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinary.api.resource(publicId)

      return !!result
    } catch (error) {
      return false
    }
  }
}
