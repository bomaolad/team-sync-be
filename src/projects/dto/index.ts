import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ProjectStatus } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'New Website Launch', description: 'Project name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Launch the new corporate website',
    description: 'Project description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Team ID',
  })
  @IsUUID()
  teamId: string;
}

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Website Redesign',
    description: 'Project name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Updated project scope',
    description: 'Project description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ProjectStatus.ACTIVE,
    enum: ProjectStatus,
    description: 'Project status',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class ProjectQueryDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Team ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiProperty({
    example: ProjectStatus.ACTIVE,
    enum: ProjectStatus,
    description: 'Filter by status',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({
    example: 'Website',
    description: 'Search by name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
