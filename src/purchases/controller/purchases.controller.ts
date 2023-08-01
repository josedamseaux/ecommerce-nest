import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PurchasesService } from '../service/purchases.service';
import { PurchaseDTO } from '../DTO/purchase.dto';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('purchases')
export class PurchasesController {

    constructor(private purchasesService: PurchasesService) { }
    
    @UseGuards(AccessTokenGuard)
    @Post('new-purchase')
    addPurchase(@Body() body: PurchaseDTO){
        this.purchasesService.createPurchase(body).then(data=>{
            console.log(data)
        })
    }
}
