import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: '2d91c3c4b5f0a5b8bb17c3adf2e4e3b5ff04d2bdb3e6b6fae5d6b3c6a3e7f8f1',
      resave: false,
      saveUninitialized: false,
      cookie:{
        maxAge: 20*60*1000,
      }
    })
  )
  await app.listen(4000);
}
bootstrap();
