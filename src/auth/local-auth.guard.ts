import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  private readonly secretKey = process.env.JWT_SECRET_KEY;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    try {
      const decodedData = jwt.verify(token, this.secretKey);
      request.user = decodedData;
      return true;
    } catch (error) {
      return false;
    }
  }
}
