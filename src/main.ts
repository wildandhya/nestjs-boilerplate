import "reflect-metadata"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { VersioningType } from "@nestjs/common";

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

  // API Version
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const documentConfig = new DocumentBuilder()
    .setOpenAPIVersion("3.0.0")
    .setTitle("NestJs Codebase")
    .setDescription("The Documentations of API")
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
      title:"NestJs CodeBase"
    },
    hideModels:true
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
