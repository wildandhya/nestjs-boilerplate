import { Module } from '@nestjs/common';
import { DatabaseService } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseService,
      inject:[ConfigService]
    })
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }