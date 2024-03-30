import { Inject, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { ShoppingCartEntity } from '../entities/shoppingCart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { TemporalShoppingCartEntity } from '../entities/temporalShoppingCart.entity';

@Injectable()
export class TemporalshoppingcartService {

    constructor(
        @InjectRepository(TemporalShoppingCartEntity) private readonly temporalShoppingCartRepository: Repository<TemporalShoppingCartEntity>,
        @Inject(REQUEST) private request) { }

    async addToTemporalShoppingCart(product: any) {
        let idForTemporalCart = product.idForTemporalCart
        const temporalShoppingCartExists = await this.temporalShoppingCartRepository.createQueryBuilder('temporalShoppingCart')
            .where("temporalShoppingCart.idCookie = :idForTemporalCart", { idForTemporalCart })
            .getRawOne();
        if (!temporalShoppingCartExists) {
            const temporalShoppingCartExists = new TemporalShoppingCartEntity();
            let items = []
            items.push(product.items)
            temporalShoppingCartExists.items = items
            temporalShoppingCartExists.idCookie = idForTemporalCart
            const result = this.temporalShoppingCartRepository.save(temporalShoppingCartExists)
            return result
        }

        if (temporalShoppingCartExists) {
            let newItems: any[] = temporalShoppingCartExists.temporalShoppingCart_items;
            newItems.push(product.items); 
            newItems = [].concat(...newItems);
            console.log(temporalShoppingCartExists)
            const result: UpdateResult = await this.temporalShoppingCartRepository.update(temporalShoppingCartExists.temporalShoppingCart_id, {
                items: newItems 
            });
            return result
        }
    }

    async getTemporalShoppingCart(idForTemporalCart: string){
        console.log(idForTemporalCart)
        const temporalShoppingCartExists = await this.temporalShoppingCartRepository.createQueryBuilder('temporalShoppingCart')
        .where("temporalShoppingCart.idCookie = :idForTemporalCart", { idForTemporalCart })
        .getRawOne(); 
        return temporalShoppingCartExists
    }

    async removeItemFromTemporalShoppingCart(id:string, idForTemporalCart: string){
        console.log(idForTemporalCart)
        const temporalShoppingCart = await this.getTemporalShoppingCart(idForTemporalCart)

        console.log(temporalShoppingCart)
        const indexToRemove = temporalShoppingCart.temporalShoppingCart_items.indexOf(id);
        if (indexToRemove !== -1) {
            temporalShoppingCart.temporalShoppingCart_items.splice(indexToRemove, 1);
        }
        const result: UpdateResult = await this.temporalShoppingCartRepository.update(temporalShoppingCart.temporalShoppingCart_id, {
            items: temporalShoppingCart.temporalShoppingCart_items
        });
        return result
    }


   async removeCart(idForTemporalCart: string){
        try {
            await this.temporalShoppingCartRepository
              .createQueryBuilder()
              .delete()
              .from(TemporalShoppingCartEntity)
              .where("idCookie = :idForTemporalCart", { idForTemporalCart })
              .execute();
          } catch (error) {
            // Manejo de errores
            console.error("Error al eliminar el carrito temporal:", error);
            throw error;
          }
    }
}
