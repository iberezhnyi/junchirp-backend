import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { useContainer } from 'class-validator'
import { AppModule } from '@/app.module'
import { ConfigService } from '@/common/configs/config.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Config
  const configService = app.get(ConfigService)
  const port = configService.port
  const isDevelopment = configService.isDevelopment

  // Cookie Parser
  app.use(cookieParser())

  // Cors
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000'],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }
  app.enableCors(corsOptions)

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // Global prefix
  app.setGlobalPrefix('api')

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Junchirp Backend')
    .setDescription('Junchirp API documentation')
    .setVersion('1.0')
    // .addServer('https://junchirp-backend.onrender.com')
    // .addServer('https://junchirp-backend.onrender.com', 'Production server')
    .addServer(
      isDevelopment
        ? 'http://localhost:3000'
        : 'https://junchirp-backend.onrender.com',
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  // Listen
  await app.listen(port, () =>
    isDevelopment
      ? console.log(`Listen on port ${port}`)
      : console.log('Server started successfully'),
  )
}

bootstrap()
