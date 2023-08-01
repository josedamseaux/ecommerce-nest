import { Global, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/module/users.module';
import { AuthService } from '../service/auth.service';
import { UsersService } from 'src/users/service/users.service';
import { AuthController } from '../controller/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';
import { AccessTokenStrategy } from '../strategies/accessToken.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Global()
@Module({
    imports: [ JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }), 
      UsersModule, 
      PassportModule],
    providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy, JwtService],
    controllers: [AuthController],
    exports: [JwtService]
})
export class AuthModule { }
