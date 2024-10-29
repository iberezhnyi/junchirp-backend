import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { useContainer } from 'class-validator'
import { AppModule } from '@/app.module'
import { ConfigService } from '@/common/configs'

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
