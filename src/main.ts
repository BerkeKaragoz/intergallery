import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: !!process.env.DEVELOPMENT,
  });

  //IMPORTANT not made for production, this is in memory
  app.use(
    session({
      secret:
        process.env.SESSION_SECRET || (!!process.env.DEVELOPMENT && 'Asecret'),
      resave: false,
      saveUnitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}

bootstrap();
