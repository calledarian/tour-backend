import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        if (username !== this.configService.get('DEFAULT_USERNAME')) {
            return null;
        }

        const hashedPassword = this.configService.get('DEFAULT_PASSWORD'); // hashed password in env
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            return { username };
        }
        return null;
    }

    async login(username: string, password: string): Promise<string> {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username };
        return this.jwtService.sign(payload);
    }
}
