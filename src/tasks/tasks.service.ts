import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, Subtask } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  TaskQueryDto,
  CreateSubtaskDto,
  UpdateSubtaskDto,
} from './dto';
import { ProjectsService } from '../projects/projects.service';
import { TaskStatus } from '../common/enums';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private subtasksRepository: Repository<Subtask>,
    private projectsService: ProjectsService,
  ) {}

  create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { assigneeIds, ...taskData } = createTaskDto;
    return this.projectsService.findOne(createTaskDto.projectId).then(() => {
      const task = this.tasksRepository.create({
        ...taskData,
        creatorId: userId,
      });

      if (assigneeIds && assigneeIds.length > 0) {
        task.assignees = assigneeIds.map((id) => ({ id }) as User);
      }

      return this.tasksRepository.save(task);
    });
  }

  findAll(query: TaskQueryDto): Promise<Task[]> {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignees', 'assignees')
      .leftJoinAndSelect('task.creator', 'creator')
      .leftJoinAndSelect('task.project', 'project');

    if (query.projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', {
        projectId: query.projectId,
      });
    }
    if (query.assigneeId) {
      queryBuilder.innerJoin(
        'task.assignees',
        'assigneeFilter',
        'assigneeFilter.id = :assigneeId',
        { assigneeId: query.assigneeId },
      );
    }
    if (query.status) {
      queryBuilder.andWhere('task.status = :status', { status: query.status });
    }
    if (query.priority) {
      queryBuilder.andWhere('task.priority = :priority', {
        priority: query.priority,
      });
    }

    return queryBuilder.orderBy('task.createdAt', 'DESC').getMany();
  }

  findByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {
        assignees: {
          id: userId,
        },
      },
      relations: ['assignees', 'project', 'creator'],
      order: { dueDate: 'ASC', priority: 'DESC' },
    });
  }

  findOne(id: string): Promise<Task> {
    return this.tasksRepository
      .findOne({
        where: { id },
        relations: ['assignees', 'creator', 'project'],
      })
      .then((task) => {
        if (!task) {
          throw new NotFoundException('Task not found');
        }
        return task;
      });
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { assigneeIds, ...taskData } = updateTaskDto;
    return this.findOne(id).then((task) => {
      if (assigneeIds) {
        task.assignees = assigneeIds.map((id) => ({ id }) as User);
      }
      this.tasksRepository.merge(task, taskData);
      return this.tasksRepository.save(task);
    });
  }

  updateStatus(
    id: string,
    updateStatusDto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<{ task: Task; requiresComment: boolean }> {
    return this.findOne(id).then((task) => {
      if (
        updateStatusDto.status === TaskStatus.RECHECK &&
        !updateStatusDto.rejectionReason
      ) {
        throw new BadRequestException(
          'Rejection reason is required for Recheck status',
        );
      }

      return this.tasksRepository
        .update(id, { status: updateStatusDto.status })
        .then(() => this.findOne(id))
        .then((updatedTask) => ({
          task: updatedTask,
          requiresComment: updateStatusDto.status === TaskStatus.RECHECK,
          rejectionReason: updateStatusDto.rejectionReason,
        }));
    });
  }

  remove(id: string): Promise<void> {
    return this.findOne(id)
      .then(() => this.tasksRepository.delete(id))
      .then(() => undefined);
  }

  getSubtasks(taskId: string): Promise<Subtask[]> {
    return this.subtasksRepository.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    });
  }

  createSubtask(
    taskId: string,
    createSubtaskDto: CreateSubtaskDto,
  ): Promise<Subtask> {
    return this.findOne(taskId).then(() => {
      const subtask = this.subtasksRepository.create({
        ...createSubtaskDto,
        taskId,
      });
      return this.subtasksRepository.save(subtask);
    });
  }

  updateSubtask(
    subtaskId: string,
    updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    return this.subtasksRepository
      .update(subtaskId, updateSubtaskDto)
      .then(() => this.subtasksRepository.findOne({ where: { id: subtaskId } }))
      .then((subtask) => {
        if (!subtask) {
          throw new NotFoundException('Subtask not found');
        }
        return subtask;
      });
  }

  removeSubtask(subtaskId: string): Promise<void> {
    return this.subtasksRepository.delete(subtaskId).then(() => undefined);
  }

  async getProjectProgress(projectId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    underReview: number;
    todo: number;
    percentage: number;
  }> {
    const total = await this.tasksRepository.count({ where: { projectId } });
    const completed = await this.tasksRepository.count({
      where: { projectId, status: TaskStatus.DONE },
    });
    const inProgress = await this.tasksRepository.count({
      where: { projectId, status: TaskStatus.IN_PROGRESS },
    });
    const underReview = await this.tasksRepository.count({
      where: { projectId, status: TaskStatus.UNDER_REVIEW },
    });
    const todo = await this.tasksRepository.count({
      where: { projectId, status: TaskStatus.TODO },
    });

    return {
      total,
      completed,
      inProgress,
      underReview,
      todo,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
