import { Injectable, OnModuleInit } from '@nestjs/common'
import { UploadService } from '@/common/upload/upload.service'
import { UPLOAD_CONSTANTS } from '@/common/configs/upload'
import * as path from 'path'
import { ConfigService } from '@/common/configs/config.service'

@Injectable()
export class DefaultAvatarService implements OnModuleInit {
  private readonly defaultAvatarFolder = UPLOAD_CONSTANTS.DEFAULT_AVATAR_FOLDER
  private readonly defaultAvatarName = UPLOAD_CONSTANTS.DEFAULT_AVATAR_NAME

  constructor(
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
  ) {}

  async onModuleInit() {
    const defaultAvatarPublicId = this.uploadService.extractPublicId(
      this.defaultAvatarName,
    )

    const defaultAvatarPublicIdWithPath =
      this.defaultAvatarFolder + defaultAvatarPublicId

    const exists = await this.uploadService.fileExistsOnCloudinary(
      defaultAvatarPublicIdWithPath,
    )

    console.log('defaultAvatar exists :>> ', exists)

    if (exists) return

    const filePath = path.join(
      this.configService.defaultAvatarsPath,
      this.defaultAvatarName,
    )

    const avatarUrl = await this.uploadService.saveFile({
      file: filePath,
      publicId: defaultAvatarPublicId,
      folder: this.defaultAvatarFolder,
    })

    this.configService.defaultAvatarUrl = avatarUrl
  }
}
