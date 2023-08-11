import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../DTO/user.dto';
import { PurchaseEntity } from 'src/purchases/entities/purchase.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchasesRepository: Repository<PurchaseEntity>) { }

  public async getUsers(page: number, limit: number): Promise<any> {
    const totalCount = await this.userRepository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const skipAmount = (page - 1) * limit;
    const users = await this.userRepository.find({
      take: limit,
      skip: skipAmount,
    });
    return {
      users: users,
      totalCount,
      totalPages
    };
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

  async findByUsername(param: string): Promise<any> {
    const user: any[] = await this.userRepository.find({
      where: [{ username: param }, { email: param }, { firstName: param }, { lastName: param }]
    })

    if (user) {
      const userIds = user.map(user => user.id);
      console.log(userIds)
      const purchases = await this.purchasesRepository.createQueryBuilder('purchase')
      .innerJoinAndSelect('purchase.user', 'user')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();

      // const { password, refreshToken, ...userWithPurchases } = user;
      user.forEach(user => {
        user.purchases = purchases.filter(purchase => purchase.user.id === user.id);
      });
      return user;
    }

    if (!user) {
      throw new NotFoundException("User not found", {
        cause: new Error(),
        description: 'user_not_found'
      })
    }

  }

  async findBy({ key, value }: { key: keyof UserDTO, value: any }) {
    try {
      const user = this.userRepository.createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne()
      return user
    } catch (error) {
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
