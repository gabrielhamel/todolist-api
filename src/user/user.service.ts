import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './user.dto';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

const KEY = 'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ';

@Injectable()
export class UserService {
  constructor(private database: PrismaService) {}

  getUserId(request: Request) {
    if (request.headers.authorization === undefined) {
      throw new Error('Authorization header is missing');
    }
    if (request.headers.authorization.split(' ')[0] !== 'Bearer') {
      throw new Error(
        'Authorization header is invalid. Only Bearer is allowed',
      );
    }
    if (request.headers.authorization.split(' ').length !== 2) {
      throw new Error(
        'Authorization header is invalid. Token must be provided',
      );
    }

    const token = request.headers.authorization.split(' ')[1];
    return jwt.verify(token, KEY).id as number;
  }

  async login(data: UserCreateDto) {
    const user = await this.database.user.findUniqueOrThrow({
      where: {
        email: data.email,
      },
    });
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    const { password, ...userData } = user;
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return {
      access_token: jwt.sign(userData, KEY, { expiresIn: '1Y' }),
    };
  }

  async create(data: UserCreateDto) {
    const { password, ...userData } = data;
    try {
      const user = await this.database.user.create({
        data: {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        },
      });
      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      throw new Error(
        `Database error. Further more https://www.prisma.io/docs/reference/api-reference/error-reference#${error.code.toLowerCase()}`,
      );
    }
  }
}
