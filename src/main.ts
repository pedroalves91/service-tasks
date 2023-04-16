import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as Log, ValidationPipe } from '@nestjs/common';
import { props } from '../config/props';

const { port } = props.server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  return app.listen(port);
}

bootstrap()
  .then(() => {
    Log.log(`Application started on port=${port}`);
  })
  .catch(Log.error);
