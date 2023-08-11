import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserDTO } from '../DTO/user.dto';
import { UsersService } from '../service/users.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';

@Controller('users')
export class UsersController {
    
    constructor(private readonly usersServices: UsersService) { }

    @UseGuards(AdminGuard, RefreshAuthGuard)
    @Get('all')
    async getUsers(@Query('page') page: number, @Query('limit') limit: number) {
      return await this.usersServices.getUsers(page, limit);
    }

    @UseGuards(AdminGuard, RefreshAuthGuard)
    @Get(':username')
    public async getUserByUsername(@Param('username') param: string) {
      return await this.usersServices.findByUsername(param)
    }

    // @Put(':id')
    // public async updateUser(@Param('id') id: string, @Body() body: UserUpdateDTO) {
    //   return await this.usersServices.updateUser(id, body)
    // }

    // @Delete(':id')
    // public async deleteUser(@Param('id') id: string) {
    //   return await this.usersServices.deleteUser(id)
    // }

    @Post('register')
    public async registerUser(@Body() body: UserDTO) {
      return await this.usersServices.createUser(body)
    }
}
