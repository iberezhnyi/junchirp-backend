import { ConfigService } from '@/common/configs/config.service'
import { v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
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
