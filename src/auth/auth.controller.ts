import {
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to authenticate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
