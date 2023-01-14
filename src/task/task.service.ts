import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskCreateDto, TaskUpdateDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private database: PrismaService) {}

  async createTask(userId: number, data: TaskCreateDto) {
    try {
      const task = await this.database.task.create({
        data: {
          ...data,
          authorId: userId,
        },
        select: {
          id: true,
          content: true,
          done: true,
        },
      });
      return task;
    } catch (error) {
      throw new Error(
        `Database error. Further more https://www.prisma.io/docs/reference/api-reference/error-reference#${error.code.toLowerCase()}`,
      );
    }
  }

  async updateTask(userId: number, taskId: number, data: TaskUpdateDto) {
    let count = 0;
    try {
      count = (
        await this.database.task.updateMany({
          where: {
            id: taskId,
            authorId: userId,
          },
          data: {
            ...data,
          },
        })
      ).count;
    } catch (error) {
      throw new Error(
        `Database error. Further more https://www.prisma.io/docs/reference/api-reference/error-reference#${error.code.toLowerCase()}`,
      );
    }
    if (count === 0) {
      throw new Error('Task not found');
    }
    return {
      id: taskId,
      content: data.content,
      done: data.done,
    };
  }

  async list(userId: number) {
    try {
      const tasks = await this.database.task.findMany({
        where: {
          authorId: userId,
        },
        select: {
          id: true,
          content: true,
          done: true,
        },
      });
      return tasks;
    } catch (error) {
      throw new Error(
        `Database error. Further more https://www.prisma.io/docs/reference/api-reference/error-reference#${error.code.toLowerCase()}`,
      );
    }
  }

  async deleteTask(userId: number, taskId: number, data: TaskUpdateDto) {
    let count = 0;
    try {
      count = (
        await this.database.task.delete({
          where: {
            id: taskId,
            authorId: userId,
          },
          data: {
            ...data,
          },
        })
      ).count;
    } catch (error) {
      throw new Error(
        `Database error. Further more https://www.prisma.io/docs/reference/api-reference/error-reference#${error.code.toLowerCase()}`,
      );
    }
    if (count === 0) {
      throw new Error('Task not found');
    }
    return {
      id: taskId,
      delete: true 
    };
  }
}
