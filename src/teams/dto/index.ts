import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering Team', description: 'Team name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'The core engineering team',
    description: 'Team description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTeamDto {
  @ApiProperty({
    example: 'Product Engineering',
    description: 'Team name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Team description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class JoinTeamDto {
  @ApiProperty({ example: 'INV-123456', description: 'Team invite code' })
  @IsString()
  inviteCode: string;
}

export class InviteMemberDto {
  @ApiProperty({
    example: 'colleague@example.com',
    description: 'Email to invite',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'MEMBER',
    enum: ['ADMIN', 'MEMBER', 'GUEST'],
    description: 'Role in team',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'MEMBER', 'GUEST'])
  role?: string;
}

export class UpdateMemberRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    enum: ['ADMIN', 'MEMBER', 'GUEST'],
    description: 'New role',
  })
  @IsEnum(['ADMIN', 'MEMBER', 'GUEST'])
  role: string;
}
