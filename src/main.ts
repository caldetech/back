import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'default-secret',
  });

  await app.register(cors, {
    origin: [
      'https://management-system-front.vercel.app',
      'https://gestao.caldetech.com.br',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });

  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  const config = new DocumentBuilder()
    .setTitle('SaaS API')
    .setDescription('Multi-tenant RBAC + CASL')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3333, '0.0.0.0');
}
bootstrap();
