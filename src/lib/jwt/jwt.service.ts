import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory, JwtSecretRequestType } from "@nestjs/jwt";
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
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
                if(requestType === JwtSecretRequestType.SIGN) return privateKey
                if(requestType === JwtSecretRequestType.VERIFY) return publicKey
                throw new Error('Invalid JWT request type');
            }
        }
    }

}