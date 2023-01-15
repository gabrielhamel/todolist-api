import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { TaskCreateDto, TaskUpdateDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
@ApiTags('Task')
@ApiBearerAuth()
export class TaskController {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
  ) {}

  @Post()
  async createTask(@Req() request: Request, @Body() body: TaskCreateDto) {
    const userId = this.userService.getUserId(request);
    return this.taskService.createTask(userId, body);
  }

  @Get()
  getTask(@Req() request: Request) {
    const userId = this.userService.getUserId(request);
    return this.taskService.list(userId);
  }

  @Put(':id')
  updateTask(
    @Req() request: Request,
    @Body() body: TaskUpdateDto,
    @Param('id') id: number,
  ) {
    const userId = this.userService.getUserId(request);
    return this.taskService.updateTask(userId, id, body);
  }

  @Delete(':id')
  deleteTask(@Req() request: Request, @Param('id') id: number) {
    const userId = this.userService.getUserId(request);
    return this.taskService.deleteTask(userId, id);
  }
}
