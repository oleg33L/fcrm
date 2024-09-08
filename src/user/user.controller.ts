// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';

// @Controller('api/v1')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post('add-user')
//   async addUser(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @Get('get-user/:id')
//   async getUser(@Param('id') id: string) {
//     console.log(id);
//     return this.userService.findOne(+id);
//   }
// }
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add-user')
  async addUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-user/:id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(+id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
