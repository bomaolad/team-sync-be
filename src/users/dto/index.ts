import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../common/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
