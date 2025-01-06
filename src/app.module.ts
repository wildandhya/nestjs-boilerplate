import { Module } from '@nestjs/common';
import { V1Module } from './modules/v1/v1.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[config]
    }),
    V1Module
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
