import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/service/users.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {

  constructor(private readonly usersServices: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest<Request>();
    const token = req.get('Authorization')?.replace('Bearer', '').trim();
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { sub: string };
      const userId = decodedToken.sub;
      const user = await this.usersServices.findUserById(userId);
      console.log(user)
      if (user?.email === process.env.SUPERUSER_EMAIL) {
        console.log('Usuario autenticado:', user);
        return true;
      } else {
        throw new UnauthorizedException('Unauthorized access');
      }
    } catch (err) {   
      console.error(err);
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}