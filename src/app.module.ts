import { Module } from '@nestjs/common';
import { Modules } from './modules';
import { DatabaseModule } from './lib/database/database.module';
import { ConfigModule } from './config/config.module';
import { SharedModule } from './lib/shared/shared.module';


@Module({
  imports: [
    ConfigModule,
    SharedModule,
    DatabaseModule,
    Modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
