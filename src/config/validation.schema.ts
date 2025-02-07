import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Server
    APP_NAME: Joi.string(),
    BASE_URL: Joi.string().required(),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),

    // Database
    DATABASE_URL: Joi.string().required(),
    DATABASE_SSL: Joi.string().default('true'),
    DATABASE_TIMEOUT: Joi.string().default('30000'),

    // Auth
    JWT_PRIVATE_KEY_BASE64: Joi.string().required(),
    JWT_PUBLIC_KEY_BASE64: Joi.string().required(),

    ENCRYPTION_KEY: Joi.string()
});