import {
    Controller,
    Post,
    Body,
    ForbiddenException,
    Res,
    UseGuards,
    Get,
    Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.auth.guard';

interface JwtUser {
    username: LoginDto['username'];
}

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
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return { message: 'Logged in successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current logged-in user' })
    @Get('/me')
    getMe(@Req() req: Request & { user: JwtUser }) {
        return { username: req.user.username };
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Log out the current user by clearing JWT cookie' })
    @Post('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        return { message: 'Logged out successfully' };
    }
}