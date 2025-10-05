import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export { LoginDto, RegisterDto };
