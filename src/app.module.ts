import { Module } from '@nestjs/common';
import { Modules } from './modules';
import { DatabaseModule } from './lib/database/database.module';
import { ConfigModule } from './config/config.module';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    Modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
