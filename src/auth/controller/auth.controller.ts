import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthBody } from '../interfaces/auth.body.interface';
import { AuthService } from '../service/auth.service';
import { RefreshAuthGuard } from '../guards/refreshToken.guard';
import { AccessTokenGuard } from '../guards/accessToken.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() req: AuthBody) {
    const username = req.username
    const password = req.password
    const result = this.authService.login(username, password);
    return result
  }

  @UseGuards(RefreshAuthGuard)
  @Get('logout')
  async logout(@Req() req: any) {
    const userId = req.user.sub
    const userLogged = await this.authService.logout(userId);
    return userLogged
  }

}
