import { Module } from '@nestjs/common'
import { ConfigModule } from '@/common/configs/config.module'
import { CloudinaryProvider } from './cloudinary.provider'
import { UploadService } from './upload.service'

@Module({
  imports: [ConfigModule],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
