import "reflect-metadata"
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./lib/interceptors/transform.interceptor";
import { NextFunction, Request, Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin:"*",
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders:['Authorization', 'Content-Type'],
    exposedHeaders:['X-Total-Count'],
    maxAge: 86400,
  })

  // Interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)))
  // pipes
  app.useGlobalPipes(new ValidationPipe())

  // API Version
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      return res.redirect('/docs'); // Redirect to /docs
    }
    next();
  });

  const documentConfig = new DocumentBuilder()
    .setOpenAPIVersion("3.0.0")
    .setTitle(process.env.APP_NAME || "NestJs Boilerplate")
    .setDescription("The Documentation of API")
    .setVersion('1.0.0')
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    })
    .addServer("http://localhost:3000", "Development Server")
    .build()

  const document = () => SwaggerModule.createDocument(app, documentConfig)

  app.use("/docs", apiReference({
    cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
    spec: { 
      content: document ,
    },
    metaData:{
      title:process.env.APP_NAME || "NestJs Boilerplate"
    },
    hideModels:true
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
