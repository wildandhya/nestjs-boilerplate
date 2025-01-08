import { JwtModuleOptions, JwtOptionsFactory, JwtSecretRequestType } from "@nestjs/jwt";
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private configService: ConfigService) {}
    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        // Fetch the private and public keys from the config service
        const privateKeyPath = this.configService.privateKeyPath
        const publicKeyPath = this.configService.publicKeyPath
        
        if (!privateKeyPath || !publicKeyPath) {
            throw new Error('Private or Public Key paths are not configured properly.');
        }

        const privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');
        const publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');

        return {
            privateKey: privateKey,
            publicKey: publicKey,
            global: true,
            signOptions: { expiresIn: "1h" },
            secretOrKeyProvider: (
                requestType: JwtSecretRequestType,
                tokenOrPayload: string | Object | Buffer,
                verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
            ) => {
                switch (requestType) {
                    case JwtSecretRequestType.SIGN:
                        return privateKey;
                    case JwtSecretRequestType.VERIFY:
                        return publicKey;
                    default:
                        return 
                }
            }
        }
    }

}