import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/service/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SuccessResponse } from '../../responses/success.response';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UsersService, private jwtService: JwtService) { }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async login(username: string, password: string) {

    const userByUsername = await this.userService.findBy({ key: 'username', value: username })
    const userByEmail = await this.userService.findBy({ key: 'email', value: username })

    // LOGIN by username
    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password)
      if (match) {
        const tokens = await this.getTokens(userByUsername.id, userByUsername.username);
        await this.updateRefreshToken(userByUsername.id, tokens.refreshToken);
        const { accessToken, refreshToken } = tokens;
        const { username } = userByUsername;
        return { accessToken, refreshToken, username };
      }

      if (!match) {
        throw new NotFoundException("Usuario o contraseña invalido", {
          cause: new Error(),
          description: 'invalid_login'
        })
      }
    }

    // LOGIN by email
      if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password)
      if (match) {
        const tokens = await this.getTokens(userByEmail.id, userByEmail.username);
        await this.updateRefreshToken(userByEmail.id, tokens.refreshToken);
        const { accessToken, refreshToken } = tokens;
        const { username } = userByEmail;
        return { accessToken, refreshToken, username };
      }
      if (!match) {
        throw new NotFoundException("Usuario o contraseña invalido", {
          cause: new Error(),
          description: 'invalid_login'
        })
      }
    }

    if (!userByUsername || !userByEmail) {
      throw new NotFoundException()
    }
    return null
  }

  async logout(userId: string): Promise<any> {

    const user = await this.userService.findUserById(userId);
    console.log(user)
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.refreshToken == null) {
      throw new ForbiddenException('User already logged out');
    }

    const userLoggedOut = await this.userService.updateUser(userId, { refreshToken: null });

    if (userLoggedOut.affected == 1) {
      return new SuccessResponse('logout successful');
    }
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, }, { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username }, { secret: process.env.JWT_REFRESH, expiresIn: '7d' },
      )
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
  }

  async refreshTokens(username: string, refreshToken: string) {
    const user = await this.userService.findByUsername(username)

    console.log(user)

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Token expired');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }


}
