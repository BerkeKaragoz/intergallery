import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getConnection } from 'typeorm';
import { AppSessionEntity as SessionEntity } from './model/entities/session.entity';
import { TypeormStore } from 'typeorm-store';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: !!process.env.DEVELOPMENT,
  });

  const sessionRepository =
    getConnection('session').getRepository(SessionEntity);
  const sess: session.SessionOptions = {
    name: process.env.SESSION_NAME, // fallbacks to: connect.sid
    secret:
      process.env.SESSION_SECRET || (!!process.env.DEVELOPMENT && 'Asecret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 3600000,
      secure: !process.env.DEVELOPMENT,
      sameSite: 'lax',
    },
    store: new TypeormStore({ repository: sessionRepository }),
  };

  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  const documentConfig = new DocumentBuilder()
    .setTitle('Intergallery API')
    .setDescription('')
    .setVersion('0.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);

  const swaggerOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Intergallery | API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  };

  SwaggerModule.setup('api', app, document, swaggerOptions);

  await app.listen(3000);
}

bootstrap();
