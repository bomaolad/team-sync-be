import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({ example: 'document.pdf', description: 'File name' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME type' })
  @IsString()
  fileType: string;

  @ApiProperty({
    example: 'https://example.com/files/document.pdf',
    description: 'File URL',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    example: 102400,
    description: 'File size in bytes',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}
