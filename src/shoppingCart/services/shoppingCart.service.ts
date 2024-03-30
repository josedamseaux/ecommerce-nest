import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartEntity } from '../entities/shoppingCart.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { TemporalshoppingcartService } from './temporalshoppingcart.service';

@Injectable()
export class ShoppingcartService {

    constructor(
        @InjectRepository(ShoppingCartEntity) private readonly shoppingCartRepository: Repository<ShoppingCartEntity>,
        @Inject(REQUEST) private request,
        private temporalShoppingCartService: TemporalshoppingcartService) { }

    getTokenAndUser() {
        console.log('executed')
        let token = this.request.get('Authorization')?.replace('Bearer', '').trim();
        console.log('token')
        let userId = ''
        console.log(token)
        if (!token) {
            // throw new UnauthorizedException('Access denied. Must be logging in to make a purchase');
            userId = 'visitor'
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_REFRESH) as { sub: string };
            userId = decodedToken.sub;
        }
        return userId;
    }

    async addToShoppingCart(product: any) {
        let userId = this.getTokenAndUser()
        console.log(userId)
        if (userId === 'visitor') {
            return this.temporalShoppingCartService.addToTemporalShoppingCart(product)
        } else {
            const userShoppingCart = await this.shoppingCartRepository.createQueryBuilder('shoppingCart')
                .where("shoppingCart.user = :userId", { userId })
                .getRawOne();

            if (userShoppingCart) {
                let newItems: any[] = userShoppingCart.shoppingCart_items;
                newItems.push(product.items);
                newItems = [].concat(...newItems);
                const result: UpdateResult = await this.shoppingCartRepository.update(userShoppingCart.shoppingCart_id, {
                    items: newItems
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

    async clearCart(id: string) {
        console.log(id)
        const shoppingCart = await this.getShoppingCart()
        // shoppingCart.shoppingCart_items = []
        const result: UpdateResult = await this.shoppingCartRepository.update(shoppingCart.shoppingCart_id, {
            items: []
        });
        console.log(shoppingCart)
        return result
    }

    async addToMergeShoppingCart(objectToMerge: any){
        const shoppingCart = await this.getShoppingCart()
        const result: UpdateResult = await this.shoppingCartRepository.update(shoppingCart.shoppingCart_id, {
            items: objectToMerge.items
        });
        return result
    }


}
