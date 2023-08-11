import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../entities/purchase.entity';
import { DeleteResult, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core'
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/service/users.service';
import { UsersPurchasesEntity } from 'src/users/entities/usersPurchases.entity';


@Injectable()
export class PurchasesService {

    users_purchase: any = {
        user: '',
        purchase: '',
        shippingAddress: '',
        status: '',
        additionalInfo: '',
    };

    constructor(@InjectRepository(PurchaseEntity) private readonly purchasesRepository: Repository<PurchaseEntity>,
        @InjectRepository(UsersPurchasesEntity) private readonly usersPurchases: Repository<UsersPurchasesEntity>,
        @Inject(REQUEST) private request,
        private readonly usersServices: UsersService) { }

    async createPurchase(purchaseBody: any) {

        const token = this.request.get('Authorization')?.replace('Bearer', '').trim();
        if (!token) {
            throw new UnauthorizedException('Access denied. Must be logging in to make a purchase');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_REFRESH) as { sub: string };
        const userId = decodedToken.sub;
        const user = await this.usersServices.findUserById(userId);
        purchaseBody.total = +purchaseBody.total
        purchaseBody.user = user.id


        await this.purchasesRepository.save(purchaseBody).then(async data => {
            console.log(data);
            this.users_purchase.user = data.user;
            this.users_purchase.purchase = data.id;
            this.users_purchase.status = purchaseBody.status;
            this.users_purchase.shippingAddress = purchaseBody.shippingAddress;
            this.users_purchase.additionalInfo = purchaseBody.additionalInfo;
            this.usersPurchases.save(this.users_purchase).then(data => {
                console.log(data)
            });
        });
    }


    async deletePurchase(id: string): Promise<PurchaseEntity> {
        try {
            console.log(id)
            const result: any = await this.purchasesRepository.findOneBy({
                id: id
            })
            // const result = this.purchasesRepository.delete(id)
            return result
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


}
