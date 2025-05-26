import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login request with username and password' })
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
    ) {
        if (!username || !password) {
            throw new BadRequestException('Username and password are required');
        }
        return this.authService.login(username, password);
    }
}
