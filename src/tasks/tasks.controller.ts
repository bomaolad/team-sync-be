import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  TaskQueryDto,
  CreateSubtaskDto,
  UpdateSubtaskDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(createTaskDto, req.user.sub);
  }

  @Get()
  findAll(@Query() query: TaskQueryDto) {
    return this.tasksService.findAll(query);
  }

  @Get('my-tasks')
  findMyTasks(@Request() req: any) {
    return this.tasksService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @Request() req: any,
  ) {
    return this.tasksService.updateStatus(id, updateStatusDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.remove(id, req.user.sub);
  }

  @Get(':id/subtasks')
  getSubtasks(@Param('id') id: string) {
    return this.tasksService.getSubtasks(id);
  }

  @Post(':id/subtasks')
  createSubtask(
    @Param('id') id: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
    @Request() req: any,
  ) {
    return this.tasksService.createSubtask(id, createSubtaskDto, req.user.sub);
  }

  @Patch('subtasks/:subtaskId')
  updateSubtask(
    @Param('subtaskId') subtaskId: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(subtaskId, updateSubtaskDto);
  }

  @Delete('subtasks/:subtaskId')
  removeSubtask(@Param('subtaskId') subtaskId: string) {
    return this.tasksService.removeSubtask(subtaskId);
  }

  @Get('project/:projectId/progress')
  getProjectProgress(@Param('projectId') projectId: string) {
    return this.tasksService.getProjectProgress(projectId);
  }
}
