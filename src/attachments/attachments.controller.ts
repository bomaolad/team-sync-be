import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks/:taskId/attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @Request() req: any,
  ) {
    return this.attachmentsService.create(
      taskId,
      createAttachmentDto,
      req.user.sub,
    );
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.attachmentsService.findByTask(taskId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.attachmentsService.remove(id, req.user.sub);
  }
}
