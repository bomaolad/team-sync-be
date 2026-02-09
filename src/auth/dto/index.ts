import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'muhammedbello.new@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (min 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Muhammed', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Bello', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'muhammed_bello', description: 'Username' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'Developer',
    description: 'Job title',
    required: false,
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'muhammedbello@gmail.com.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token',
  })
  accessToken: string;

  @ApiProperty({ example: 'Login successful', description: 'Success message' })
  message: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'muhammedbello@gmail.com',
      firstName: 'Muhammed',
      lastName: 'Bello',
      role: 'MEMBER',
    },
    description: 'User details',
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'muhammedbello@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'abc123token',
    description: 'Reset token from email',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (min 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class MessageResponseDto {
  @ApiProperty({
    example: 'Password reset link sent',
    description: 'Success message',
  })
  message: string;
}
