import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory, JwtSecretRequestType } from "@nestjs/jwt";
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { ConfigService } from "src/config/config.service";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private configService: ConfigService) { }
    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        const {privateKey, publicKey} = this.getKeys()
        return {
            global: true,
            signOptions: {
                algorithm: 'RS256',  // Specify the algorithm
                expiresIn: "1h"
            },
            verifyOptions: {
                algorithms: ['RS256']  // Specify allowed algorithms for verification
            },
            secretOrKeyProvider: (
                requestType: JwtSecretRequestType,
                tokenOrPayload: string | Object | Buffer,
                verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
            ) => {
                if (requestType === JwtSecretRequestType.SIGN) return privateKey
                if (requestType === JwtSecretRequestType.VERIFY) return publicKey
                throw new Error('Invalid JWT request type');
            }
        }
    }

    private getKeys(): { privateKey: string; publicKey: string } {
        // In production, use base64-encoded keys from env variables
        const privateKeyBase64 = this.configService.privateKey
        const publicKeyBase64 = this.configService.publicKey

        if (!privateKeyBase64 || !publicKeyBase64) {
            throw new Error('Base64 encoded keys are not configured in environment variables.');
        }

        try {
            return {
                privateKey: Buffer.from(privateKeyBase64, 'base64').toString('utf-8'),
                publicKey: Buffer.from(publicKeyBase64, 'base64').toString('utf-8')
            };
        } catch (error) {
            throw new Error(`Failed to decode base64 keys: ${error.message}`);
        }
    }

}