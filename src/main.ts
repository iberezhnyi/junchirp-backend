import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from './common/configs'
import { AppModule } from './app.module'

import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  const corsOptions: CorsOptions = {
    origin: ['http://localhost:5173'],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }

  app.enableCors(corsOptions)

  app.useGlobalPipes(new ValidationPipe())

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // Включает преобразования
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // )

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const configService = app.get(ConfigService)
  const port = configService.port
  const isDevelopment = configService.isDevelopment

  app.setGlobalPrefix('api')

  await app.listen(port, () =>
    isDevelopment
      ? console.log(`Listen on port ${port}`)
      : console.log('Server started successfully'),
  )
}
bootstrap()
