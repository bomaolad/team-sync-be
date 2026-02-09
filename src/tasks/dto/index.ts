import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix login page bug', description: 'Task title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Users cannot login with email',
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Project ID',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Assignee User IDs',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];

  @ApiProperty({
    example: TaskPriority.HIGH,
    enum: TaskPriority,
    description: 'Task priority',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    example: '2026-01-01T12:00:00Z',
    description: 'Start date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2026-01-10T12:00:00Z',
    description: 'Due date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Update login page UI',
    description: 'New title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'New description details',
    description: 'New description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'New assignee IDs',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];

  @ApiProperty({
    example: TaskPriority.MEDIUM,
    enum: TaskPriority,
    description: 'New priority',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    example: '2026-02-01T12:00:00Z',
    description: 'New start date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2026-02-10T12:00:00Z',
    description: 'New due date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty({
    example: TaskStatus.DONE,
    enum: TaskStatus,
    description: 'New status',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    example: 'Code quality issues',
    description: 'Rejection reason (if applicable)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class TaskQueryDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Project ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Assignee ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiProperty({
    example: TaskStatus.TODO,
    enum: TaskStatus,
    description: 'Status filter',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: TaskPriority.HIGH,
    enum: TaskPriority,
    description: 'Priority filter',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}

export class CreateSubtaskDto {
  @ApiProperty({ example: 'Write unit tests', description: 'Subtask title' })
  @IsString()
  title: string;
}

export class UpdateSubtaskDto {
  @ApiProperty({
    example: 'Refactor tests',
    description: 'New title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: true,
    description: 'Mark as completed',
    required: false,
  })
  @IsOptional()
  isCompleted?: boolean;
}
