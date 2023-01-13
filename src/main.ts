import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: any) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    this.httpAdapterHost.reply(
      ctx.getResponse(),
      {
        message: exception.message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Todo list API')
    .setDescription('Todo list API specifications and routes')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  if (process.env.APP_ENV !== 'production') {
    SwaggerModule.setup('openapi', app, document);
  }

  // For class-transormer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      always: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        return {
          message: errors
            .map((error) =>
              Object.keys(error.constraints!)
                .map((key) => error.constraints![key])
                .join(', '),
            )
            .join(', '),
        };
      },
    }),
  );

  // https://github.com/nestjs/nest/issues/528#issuecomment-382330137
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter as any));

  await app.listen(8080);
}
bootstrap();
