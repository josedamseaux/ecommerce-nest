import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../service/auth.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    const userCookie = req.cookies.userCookie;
    console.log('entro middlerae');
    console.log(refreshToken);
    
    console.log(userCookie);

     if(!refreshToken){
      console.log('no hay refresh')
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}