import { Module } from '@nestjs/common'
import { ConfigModule } from '@/common/configs/config.module'
import { CloudinaryProvider } from '@/common/configs/upload'
import { UploadService } from './upload.service'
import { DefaultAvatarService } from './default-avatar.service'

@Module({
  imports: [ConfigModule],
  providers: [UploadService, DefaultAvatarService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
