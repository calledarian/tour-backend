import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<any> {
        if (
            username === process.env.DEFAULT_USERNAME &&
            password === process.env.DEFAULT_PASSWORD
        ) {
            return { username };
        }
        return null;
    }

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
