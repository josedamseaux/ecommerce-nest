import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../DTO/user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) { }

  public async getUsers(): Promise<UsersEntity[]> {
    return await this.userRepository.find();
  }

  public async findUserById(id: string) {
    const user: UsersEntity = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException("User not found", {
        cause: new Error(),
        description: 'User_not_found'
      })
    }
    return user
  }

  async findByUsername(username: any): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username: username.username } });
    if (!user) {
      throw new NotFoundException("user not found")
    }
    const { password, createdAt, updatedAt, ...result } = user;

    return user;
  }

  async findBy({ key, value }: { key: keyof UserDTO, value: any }) {
    try {
      const user = this.userRepository.createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne()
      return user
    } catch (error) {
      // throw ErrorManager.createSignatureError(error.message)
      throw new NotFoundException("User not found", {
        cause: new Error(),
        description: 'user_not_found'
      })
    }
  }

  async createUser(body: UserDTO): Promise<UsersEntity> {
    try {
      body.password = await bcrypt.hash(body.password, +process.env.HASH_SALT)
      return await this.userRepository.save(body)
    } catch (error) {
      console.log(error)
      if (error.code = '23505') {
        throw new BadRequestException(
          'USUARIO ya existe',
          {
            cause: new Error(),
            description: 'user_exists'
          }
        )
      }
    }
  }

  // implementing tuiitter nestjs

  updateUser(id: any, user: any) {
    try {
      return this.userRepository.update(id, user);
    } catch (error) {
      console.log(error)
    }
  }

  removeUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

}
