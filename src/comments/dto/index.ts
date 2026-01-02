import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This looks good to me.',
    description: 'Comment content',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: false,
    description: 'Is this a rejection comment?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRejection?: boolean;
}
