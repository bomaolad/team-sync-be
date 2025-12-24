import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
  ) {}

  create(
    taskId: string,
    createAttachmentDto: CreateAttachmentDto,
    userId: string,
  ): Promise<Attachment> {
    const attachment = this.attachmentsRepository.create({
      ...createAttachmentDto,
      taskId,
      uploadedById: userId,
    });
    return this.attachmentsRepository.save(attachment);
  }

  findByTask(taskId: string): Promise<Attachment[]> {
    return this.attachmentsRepository.find({
      where: { taskId },
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<Attachment> {
    return this.attachmentsRepository
      .findOne({
        where: { id },
        relations: ['uploadedBy'],
      })
      .then((attachment) => {
        if (!attachment) {
          throw new NotFoundException('Attachment not found');
        }
        return attachment;
      });
  }

  remove(id: string, userId: string): Promise<void> {
    return this.findOne(id)
      .then((attachment) => {
        if (attachment.uploadedById !== userId) {
          throw new ForbiddenException('Cannot delete others attachments');
        }
        return this.attachmentsRepository.delete(id);
      })
      .then(() => undefined);
  }
}
