import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;
}
