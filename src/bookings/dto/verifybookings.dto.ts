import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyBookingsDto {
    @ApiProperty({ description: 'Email address used to make the booking' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ description: 'Unique reference code for the booking' })
    @IsString({ message: 'Reference code must be a string' })
    @IsNotEmpty({ message: 'Reference code is required' })
    referenceCode: string;
}
