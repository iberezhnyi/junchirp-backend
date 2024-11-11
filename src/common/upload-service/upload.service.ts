import { Injectable, NotFoundException } from '@nestjs/common'
import { Express } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { ConfigService } from '@/common/configs/config.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueFileName = `${uuidv4()}_${file.originalname}`
    const uploadPath = this.configService.uploadFolderPath
    const filePath = path.join(uploadPath, uniqueFileName)

    fs.writeFileSync(filePath, file.buffer)

    // return filePath
    return uniqueFileName
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.configService.uploadFolderPath, fileName)

    if (!fs.existsSync(filePath)) throw new NotFoundException('File not found')

    fs.unlinkSync(filePath)
  }
}
