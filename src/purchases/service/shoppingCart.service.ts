import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartEntity } from '../entities/shoppingCart.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/service/users.service';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ShoppingcartService {

    constructor(
        @InjectRepository(ShoppingCartEntity) private readonly shoppingCartRepository: Repository<ShoppingCartEntity>,
        @Inject(REQUEST) private request,
        private readonly usersServices: UsersService) { }

    getTokenAndUser() {
        const token = this.request.get('Authorization')?.replace('Bearer', '').trim();
        if (!token) {
            throw new UnauthorizedException('Access denied. Must be logging in to make a purchase');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_REFRESH) as { sub: string };
        const userId = decodedToken.sub;
        return userId;
    }

    async addToShoppingCart(product: any) {
        let userId = this.getTokenAndUser()

        const userShoppingCart = await this.shoppingCartRepository.createQueryBuilder('shoppingCart')
            .where("shoppingCart.user = :userId", { userId })
            .getRawOne();

        if (userShoppingCart) {
            let newItems: any[] = userShoppingCart.shoppingCart_items; // Inicializar con los elementos existentes
            newItems.push(product.items); // Agregar el nuevo producto a la matriz
            newItems = [].concat(...newItems);
            const result: UpdateResult = await this.shoppingCartRepository.update(userShoppingCart.shoppingCart_id, {
                items: newItems // Actualiza el campo "items" con los nuevos productos
            });
            return result
        }
        if (!userShoppingCart) {
            let items = []
            items.push(product.items)
            product.user = userId
            product.items = items
            const result = this.shoppingCartRepository.save(product)
            return result
        }
        return userShoppingCart
    }

    removeCart(id: any): Promise<DeleteResult> {
        const result = this.shoppingCartRepository.delete(id);
        result.then(data => { console.log(data) })
        return result
    }

    async getShoppingCart() {
        let userId = this.getTokenAndUser()
        const userShoppingCart = await this.shoppingCartRepository.createQueryBuilder('shoppingCart')
            .where("shoppingCart.user = :userId", { userId })
            .getRawOne();
        return userShoppingCart;
    }

    async removeItemFromShoppingCart(id: string) {
        console.log(id)
        const shoppingCart = await this.getShoppingCart()
        const indexToRemove = shoppingCart.shoppingCart_items.indexOf(id);
        console.log(indexToRemove)
        if (indexToRemove !== -1) {
            shoppingCart.shoppingCart_items.splice(indexToRemove, 1);
        }
        const result: UpdateResult = await this.shoppingCartRepository.update(shoppingCart.shoppingCart_id, {
            items: shoppingCart.shoppingCart_items
        });
        console.log(shoppingCart)
        return result
    }


}
