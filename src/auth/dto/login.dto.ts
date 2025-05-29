import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Username of the admin' })
    @IsString({ message: 'Must be a string' })
    @IsNotEmpty({ message: 'Must not be empty' })
    username: string;

    @ApiProperty({ description: 'Password of the admin' })
    @IsString({ message: 'Must be a string' })
    @IsNotEmpty({ message: 'Must not be empty' })
    @MinLength(8, { message: 'Minimum length is 8 characters' })
    password: string;

    @ApiProperty({ required: false, description: 'Honeypot for auto bots' })
    @IsOptional()
    @IsString()
    extra_field?: string;
}