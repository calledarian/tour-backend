import {
    Controller,
    Post,
    Body,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    @ApiOperation({ summary: 'Login request with username and password' })
    async login(@Body() body: LoginDto) {
        const { username, password, extra_field } = body;

        // Honeypot bot detection
        if (extra_field) {
            throw new ForbiddenException('Bot detected');
        }

        return this.authService.login(username, password);
    }
}