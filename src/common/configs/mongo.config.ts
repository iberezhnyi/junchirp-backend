import { ConfigService } from './config.service'
import { MongooseModuleOptions } from '@nestjs/mongoose'

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
  }
}

const getMongoString = (configService: ConfigService): string => {
  const uri =
    'mongodb+srv://' +
    configService.mongoUser +
    ':' +
    configService.mongoPassword +
    '@' +
    configService.mongoHost +
    '/' +
    configService.mongoDbName +
    '?' +
    'retryWrites=true&w=majority&appName=Cluster0'

  if (!uri) throw new Error('URI is not defined')

  return uri
}
