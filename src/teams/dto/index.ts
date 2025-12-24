import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class JoinTeamDto {
  @IsString()
  inviteCode: string;
}

export class InviteMemberDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'MEMBER', 'GUEST'])
  role?: string;
}

export class UpdateMemberRoleDto {
  @IsEnum(['ADMIN', 'MEMBER', 'GUEST'])
  role: string;
}
