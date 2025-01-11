import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';

const DATABASE_CONFIG = {
  RETRY_ATTEMPTS: 10,
  RETRY_DELAY: 3000, // milliseconds
  AUTO_LOAD_ENTITIES: true,
  LOGGING: "simple-console",
} as const;


@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseService.name)

  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    try {
      const config: TypeOrmModuleOptions = {
        type: "postgres",
        url: this.configService.databaseUrl,
        synchronize: !this.configService.isProduction,
        entities: [
          join(__dirname, '..', 'dist', 'modules', '**', '*.entity.{ts,js}'),
          join(__dirname, '..', 'src', 'modules', '**', '*.entity.{ts,js}')
        ],
        autoLoadEntities: DATABASE_CONFIG.AUTO_LOAD_ENTITIES,
        // logger: "advanced-console",
        logging:this.configService.isDevelopment,
        retryAttempts: DATABASE_CONFIG.RETRY_ATTEMPTS,
        retryDelay: DATABASE_CONFIG.RETRY_DELAY,
        poolSize: 20,
        extra: {
          max: 20,
        },
      }

      this.logger.log(`Database configuration loaded for environment: ${this.configService.nodeEnv}`);
      this.logger.debug(`Entity paths: ${config.entities}`);

      return config
    } catch (error) {
      this.logger.error(
        `Failed to create TypeORM configuration: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}