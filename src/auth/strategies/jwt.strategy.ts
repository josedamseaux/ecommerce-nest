
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([(request: any) => {
    //     return request?.cookies?.Authentication;
    //   }]),
    //   ignoreExpiration: false,
    //   secretOrKey: process.env.JWT_SECRET,
    // });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }

  // async validate2(payload: any) {
  //   return this.userService.findUserById(payload.userId);
  // }

}