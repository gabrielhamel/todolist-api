import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, Length } from 'class-validator';

export class TaskCreateDto {
  @Length(1, 1024)
  @ApiProperty({
    example: 'Do something',
    description: 'The title of the task',
  })
  content: string;
}

export class TaskUpdateDto {
  @Length(1, 1024)
  @ApiProperty({
    example: 'Do something',
    description: 'The title of the task',
  })
  content: string;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'The status of the task',
  })
  done: boolean;
}
