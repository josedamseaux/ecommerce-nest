import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../entities/purchase.entity';
import { Repository } from 'typeorm';
import { PurchaseDTO } from '../DTO/purchase.dto';
import { REQUEST } from '@nestjs/core'
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/service/users.service';
import { SuccessResponse } from 'src/responses/success.response';

@Injectable()
export class PurchasesService {

    constructor(@InjectRepository(PurchaseEntity)
    private readonly purchasesRepository: Repository<PurchaseEntity>,
        @Inject(REQUEST) private request,
        private readonly usersServices: UsersService) { }

    async createPurchase(purchase: PurchaseDTO) {
        const token = this.request.get('Authorization')?.replace('Bearer', '').trim();
        console.log(token)
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_REFRESH) as { sub: string };
        const userId = decodedToken.sub;
        const user = await this.usersServices.findUserById(userId);
        console.log(user)
        purchase.total = +purchase.total
        purchase.user = user.id
        console.log(purchase)

        const result = this.purchasesRepository.save(purchase)

        result.then(data => {
            console.log(data)

            if (data) {
                return { message: 'Purchase successful' }; // Devolver un objeto con el mensaje
            }
        })
    }
}
