import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  register(@Body() body: UserCreateDto) {
    return this.userService.create(body);
  }

  @Post('login')
  login(@Body() body: UserCreateDto) {
    return this.userService.login(body);
  }
}
