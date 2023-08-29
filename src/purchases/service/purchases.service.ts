import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../entities/purchase.entity';
import { DeleteResult, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core'
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/service/users.service';
import { UsersPurchasesEntity } from 'src/users/entities/usersPurchases.entity';


@Injectable()
export class PurchasesService {

    constructor(@InjectRepository(PurchaseEntity) private readonly purchasesRepository: Repository<PurchaseEntity>,
        @InjectRepository(UsersPurchasesEntity) private readonly usersPurchasesRepository: Repository<UsersPurchasesEntity>,
        @Inject(REQUEST) private request,
        private readonly usersServices: UsersService) { }
        
    data = {
        cartWithUserInfo: {
            cart: [],
            shippingInfo: ''
          }
    };
    
    async createPurchase(purchaseBody: any): Promise<any> {
        try {
            const token = this.request.get('Authorization')?.replace('Bearer', '').trim();
            if (!token) {
                throw new UnauthorizedException('Access denied. Must be logged in to make a purchase');
            }
    
            const decodedToken = jwt.verify(token, process.env.JWT_REFRESH) as { sub: string };
            const userId = decodedToken.sub;
            const user = await this.usersServices.findUserById(userId);
    
            const totalAmountSum = purchaseBody.cartWithUserInfo.cart.reduce((total, item) => total + item.totalAmount, 0);
            const idsCartsArray = purchaseBody.cartWithUserInfo.cart.map(item => item.id);
    
            let dataForPurcharseRepository = {
                user: user,
                total: +totalAmountSum,
                products: idsCartsArray,
            };
    
            const purchaseData = await this.purchasesRepository.save(dataForPurcharseRepository);
    
            let dataForUsersPurchasesRepository: any = {
                user: purchaseData.user,
                purchase: purchaseData.id,
                status: 'NOTPAID',
                total: +totalAmountSum,
                sessionId: purchaseBody.cartWithUserInfo.sessionId,
                shippingAddress: purchaseBody.cartWithUserInfo.shippingInfo,
                additionalInfo: purchaseBody.cartWithUserInfo.additionalInfo
            };
    
            const usersPurchaseData = await this.usersPurchasesRepository.save(dataForUsersPurchasesRepository);
    
            return usersPurchaseData; // Devuelve los datos de la compra realizada por el usuario
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


    async deleteUsersPurchase(id: string): Promise<PurchaseEntity> {
        try {
            console.log(id)
            const result: any = await this.usersPurchasesRepository.delete({
                id: id
            })
            return result
        } catch (error) {
            return error.message
        }
    }

    async deletePurchase(id: string): Promise<PurchaseEntity> {
        try {
            console.log(id)
            const result: any = await this.purchasesRepository.delete({
                id: id
            })
            return result
        } catch (error) {
            return error.message
        }
    }

   async getPurchases(){
        try {
            const purchases = await this.purchasesRepository.find();
            return purchases
        } catch (error) {
            return error.message
        }
    }

    async getPurchasesById(id: string): Promise<any> {
        try {
            const purchases = await this.purchasesRepository.find({
                where: {
                    user: { id } // Filtrar por user_id
                },
            });
            return purchases
        } catch (error) {
            return error.message
        }

    }


    async getUsersPurchasesById(id: string): Promise<any> {
        try {
            const purchases = await this.usersPurchasesRepository.findOne({
                where: {
                    id: id  // Filtrar por user_id
                },
            });

            if(!purchases){
                return 'not found'
            }
            return purchases
        } catch (error) {
            return error.message
        }

    }

    async updatePurchaseStatus(id: string): Promise<any> {
        try {
            const purchase = await this.usersPurchasesRepository.findOne({
                where: {
                    id: id  // Filtrar por id
                },
            });

          if (!purchase) {
            return 'not found';
          }
          
          purchase.status = 'PAID';
          
          const updatedPurchase = await this.usersPurchasesRepository.save(purchase);
          
          return updatedPurchase;
        } catch (error) {
          return error.message;
        }
      }

}
