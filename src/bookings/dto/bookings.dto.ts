import {
    IsInt,
    IsString,
    IsEmail,
    IsOptional,
    IsNumber,
    Min,
    Length,
    IsDate,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({ description: 'ID of the tour being booked' })
    @IsInt({ message: 'tourId must be an integer' })
    @IsNotEmpty({ message: 'tourId is required' })
    tourId: number;

    @ApiProperty({ description: 'Full name of the person booking' })
    @IsString({ message: 'Name must be a string' })
    @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'Email address of the person booking' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ description: 'Number of people for the booking (minimum 1)' })
    @IsInt({ message: 'People must be an integer' })
    @Min(1, { message: 'At least one person must be booked' })
    @IsNotEmpty({ message: 'People is required' })
    people: number;

    @ApiProperty({ description: 'Contact phone number' })
    @IsString({ message: 'Phone must be a string' })
    @Length(1, 20, { message: 'Phone must be between 1 and 20 characters' })
    @IsNotEmpty({ message: 'Phone is required' })
    phone: string;

    @ApiProperty({ description: 'Date of the tour' })
    @Type(() => Date)
    @IsDate({ message: 'tourDate must be a valid date' })
    @IsNotEmpty({ message: 'tourDate is required' })
    tourDate: Date;

    @ApiProperty({ description: 'Additional notes (optional)', required: false })
    @IsOptional()
    @IsString({ message: 'Notes must be a string' })
    @Length(0, 500, { message: 'Notes must be up to 500 characters' })
    notes?: string;

    @ApiProperty({ description: 'Total price for the booking' })
    @IsNumber({}, { message: 'totalPrice must be a number' })
    @IsNotEmpty({ message: 'totalPrice is required' })
    totalPrice: number;

    @ApiProperty({ description: "Booking status, defaults to 'pending'", required: false })
    @IsOptional()
    @IsString({ message: 'Status must be a string' })
    status?: string;

    @IsString()
    @IsNotEmpty()
    captchaToken: string;
}
