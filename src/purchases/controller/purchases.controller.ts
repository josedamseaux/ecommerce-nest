import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PurchasesService } from '../service/purchases.service';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('purchases')
export class PurchasesController {

    constructor(private purchasesService: PurchasesService) { }
    
    @UseGuards(RefreshAuthGuard)
    @Post('new-purchase')
    addPurchase(@Body() body: any){
        this.purchasesService.createPurchase(body)
    }

    @UseGuards(RefreshAuthGuard)
    @UseGuards(AdminGuard)
    @Delete('delete-purchase/:id')
    deletePurchase(@Param('id') id: string){
      return this.purchasesService.deleteUsersPurchase(id)
    }

    @UseGuards(RefreshAuthGuard)
    @Get('get-purchases')
    getAllPurchases(){
      return this.purchasesService.getPurchases()
    }

    @UseGuards(RefreshAuthGuard)
    @Get('get-purchases-by-user/:id')
    getPurchasesById(@Param('id') id: string){
      return this.purchasesService.getPurchasesById(id)
    }

    
}
