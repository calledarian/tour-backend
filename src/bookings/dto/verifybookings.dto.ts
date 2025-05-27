import { IsEmail, IsString } from 'class-validator';

export class VerifyBookingsDto {
    @IsEmail()
    email: string;

    @IsString()
    referenceCode: string;
}