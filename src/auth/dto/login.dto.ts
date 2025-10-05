import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}
