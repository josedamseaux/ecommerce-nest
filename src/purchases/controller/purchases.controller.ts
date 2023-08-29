import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PurchasesService } from '../service/purchases.service';
import { PurchaseDTO } from '../DTO/purchase.dto';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import { ShoppingcartService } from '../service/shoppingCart.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('purchases')
export class PurchasesController {

    constructor(private purchasesService: PurchasesService, private shoppingCartService: ShoppingcartService) { }
    
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
    @UseGuards(AdminGuard)
    @Delete('delete-purchase-by-id/:id')
    deletePurchaseById(@Param('id') id: string){
      return this.purchasesService.deletePurchase(id)
    }

    @UseGuards(RefreshAuthGuard)
    @Get('get-purchases-by-id/:id')
    getPurchasesById(@Param('id') id: string){
      return this.purchasesService.getUsersPurchasesById(id)
    }

    @UseGuards(RefreshAuthGuard)
    @Get('shoppingcart/get-items-from-cart')
    getItemsFromShoppingCart(){
        return this.shoppingCartService.getShoppingCart()
    }
    
    @UseGuards(RefreshAuthGuard)
    @Post('shoppingcart/add')
    addToShoppingCart(@Body() body: PurchaseDTO){
        return this.shoppingCartService.addToShoppingCart(body)
    }

    @UseGuards(RefreshAuthGuard)
    @Put('shoppingcart/delete/:id')
    delete(@Param('id') id: string){
        return this.shoppingCartService.removeItemFromShoppingCart(id)
    }

    @Delete('shoppingcart/delete-entry/:id')
    deleteEntry(@Param('id') id: string){
        return this.shoppingCartService.removeCart(id)
    }

}
