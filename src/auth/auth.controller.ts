import {
    Controller,
    Post,
    Body,
    ForbiddenException,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    @ApiOperation({ summary: 'Login request with username and password' })
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { username, password, extra_field } = body;

        // Honeypot bot detection
        if (extra_field) {
            throw new ForbiddenException('Bot detected');
        }

        const token = await this.authService.login(username, password);

        // Set JWT token as httpOnly cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return { message: 'Logged in successfully' };
    }
}
