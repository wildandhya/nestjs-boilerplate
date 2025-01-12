import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService<EnvironmentVariables>) { }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV')
  }

  get privateKey(): string {
    return this.configService.get('JWT_PRIVATE_KEY_BASE64')
  }

  get publicKey(): string {
    return this.configService.get('JWT_PUBLIC_KEY_BASE64')
  }

  get isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development';
  }

  get isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }



  getDatabaseConfig() {
    return {
      url: this.databaseUrl,
      ssl: this.configService.get('DATABASE_SSL') === 'true',
      timeout: parseInt(this.configService.get('DATABASE_TIMEOUT', '30000')),
    };
  }
}