import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../DTO/user.dto';
import { ShoppingCartEntity } from 'src/shoppingCart/entities/shoppingCart.entity';
// import { PurchaseEntity } from 'src/purchases/entities/purchase.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(ShoppingCartEntity) private readonly shoppingCartRepository: Repository<ShoppingCartEntity>,
    ) { }

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
      where: [{ email: param }, { firstName: param }, { lastName: param }]
    })

    if (user) {
      const userIds = user.map(user => user.id);
      console.log(userIds)
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
    console.log(key)
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
      let user = this.userRepository.save(body)
      // Se crea un carrito de compras vacio para el user recien creado
      let bodyToInsertFirstShoppingCart: any = {
        user: '',
        items: []
      };
      bodyToInsertFirstShoppingCart.user = (await user).id
      bodyToInsertFirstShoppingCart.items = []
      this.shoppingCartRepository.save(bodyToInsertFirstShoppingCart)
      return user
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
