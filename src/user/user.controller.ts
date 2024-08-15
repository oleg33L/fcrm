import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/local-auth.guard';
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(AuthGuard)
  @Post('add-user')
  async addUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-user/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
