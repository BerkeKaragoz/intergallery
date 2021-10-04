import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getConnection } from 'typeorm';
import { AppSessionEntity as SessionEntity } from './model/entities/session.entity';
import { TypeormStore } from 'typeorm-store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: !!process.env.DEVELOPMENT,
  });

  const repository = getConnection().getRepository(SessionEntity);

  const sess: session.SessionOptions = {
    secret:
      process.env.SESSION_SECRET || (!!process.env.DEVELOPMENT && 'Asecret'),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: !process.env.DEVELOPMENT },
    store: new TypeormStore({ repository }),
  };

  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}

bootstrap();
