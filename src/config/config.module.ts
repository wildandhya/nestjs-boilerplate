import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
    //   isGlobal: false,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema,
      validationOptions: {
        abortEarly: false, // Shows all validation errors at once
        allowUnknown: true, // Allows other env vars not specified in schema
      },
    }),
  ],
  providers:[ConfigService],
  exports:[ConfigService]
})
export class ConfigModule {}