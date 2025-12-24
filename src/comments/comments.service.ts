import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      taskId,
      userId,
    });
    return this.commentsRepository.save(comment);
  }

  createSystemMessage(
    taskId: string,
    content: string,
    userId: string,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      taskId,
      userId,
      content,
      isSystemMessage: true,
    });
    return this.commentsRepository.save(comment);
  }

  findByTask(taskId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  findOne(id: string): Promise<Comment> {
    return this.commentsRepository
      .findOne({
        where: { id },
        relations: ['user'],
      })
      .then((comment) => {
        if (!comment) {
          throw new NotFoundException('Comment not found');
        }
        return comment;
      });
  }

  remove(id: string, userId: string): Promise<void> {
    return this.findOne(id)
      .then((comment) => {
        if (comment.userId !== userId) {
          throw new NotFoundException('Cannot delete others comments');
        }
        return this.commentsRepository.delete(id);
      })
      .then(() => undefined);
  }
}
