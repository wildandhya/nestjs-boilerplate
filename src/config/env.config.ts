export interface EnvironmentVariables {
    // Server
    APP_NAME: string
    NODE_ENV: string;
    PORT: number;

    // Database
    DATABASE_URL: string;
    DATABASE_SSL: string;
    DATABASE_TIMEOUT: string;

    // Auth
    JWT_PRIVATE_KEY_PATH: string;
    JWT_PUBLIC_KEY_PATH: string
    JWT_EXPIRATION: string;
}