import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PurchasesService } from '../service/purchases.service';
import { PurchaseDTO } from '../DTO/purchase.dto';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import { ShoppingcartService } from '../service/shoppingCart.service';

@Controller('purchases')
export class PurchasesController {

    constructor(private purchasesService: PurchasesService, private shoppingCartService: ShoppingcartService) { }
    
    @UseGuards(RefreshAuthGuard)
    @Post('new-purchase')
    addPurchase(@Body() body: PurchaseDTO){
        this.purchasesService.createPurchase(body)
    }

    @UseGuards(RefreshAuthGuard)
    @Delete('delete-purchase/:id')
    deletePurchase(@Param('id') id: string){
      return this.purchasesService.deletePurchase(id)
    }

    @UseGuards(RefreshAuthGuard)
    @Get('get-purchases-by-id/:id')
    getPurchasesById(@Param('id') id: string){
      return this.purchasesService.getPurchasesById(id)
    }

    @UseGuards(RefreshAuthGuard)
    @Get('shoppingcart/get-items-from-cart')
    getItemsFromShoppingCart(){
        return this.shoppingCartService.getItemsFromShoppingCart()
    }
    
    @UseGuards(RefreshAuthGuard)
    @Post('shoppingcart/add')
    addToShoppingCart(@Body() body: PurchaseDTO){
        return this.shoppingCartService.addToShoppingCart(body)
    }

    // @UseGuards(RefreshAuthGuard)
    @Delete('shoppingcart/delete/:id')
    delete(@Param('id') id: string){
        return this.shoppingCartService.removeCart(id)
    }

}
