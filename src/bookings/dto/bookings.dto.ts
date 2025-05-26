import { IsInt, IsString, IsEmail, IsOptional, IsNumber, Min, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty()
    @IsInt()
    tourId: number;

    @ApiProperty()
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    people: number;

    @ApiProperty()
    @IsString()
    @Length(1, 20)
    phone: string;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    tourDate: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty()
    @IsNumber()
    totalPrice: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    status?: string;  // optional, defaults to 'pending' in entity
}
