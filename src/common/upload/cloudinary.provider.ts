import { ConfigService } from '@/common/configs/config.service'
import { v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.cloudinaryCloudName,
      api_key: configService.cloudinaryApiKey,
      api_secret: configService.cloudinaryApiSecret,
    })
    return cloudinary
  },
  inject: [ConfigService],
}
