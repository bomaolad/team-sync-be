import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isRejection?: boolean;
}
