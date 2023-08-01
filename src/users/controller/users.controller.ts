import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDTO } from '../DTO/user.dto';
import { UsersService } from '../service/users.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('users')
export class UsersController {
    
    constructor(private readonly usersServices: UsersService) { }

    @UseGuards(AdminGuard, AccessTokenGuard)
    @Get('all')
    public async getAllUsers(){
      return await this.usersServices.getUsers()
    }

    @Post('register')
    public async registerUser(@Body() body: UserDTO) {
      return await this.usersServices.createUser(body)
    }
}
