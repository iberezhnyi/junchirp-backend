import { ConfigService } from '@/common/configs/config.service'
import { Provider } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { UPLOAD } from '@/common/configs/upload'

export const CloudinaryProvider: Provider = {
  provide: UPLOAD.PROVIDERS.CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.cloudinaryCloudName,
      api_key: configService.cloudinaryApiKey,
      api_secret: configService.cloudinaryApiSecret,
      secure: true,
    })
    return cloudinary
  },
  inject: [ConfigService],
}
