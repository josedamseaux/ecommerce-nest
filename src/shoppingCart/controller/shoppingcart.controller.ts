import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ShoppingcartService } from '../../shoppingCart/services/shoppingCart.service';
import { TemporalshoppingcartService } from '../services/temporalshoppingcart.service';


@Controller('shoppingcart')
export class ShoppingcartController {

    constructor(private shoppingCartService: ShoppingcartService,
         private temporalShoppingCartService: TemporalshoppingcartService) { }


    // @UseGuards(RefreshAuthGuard)
    @Get('get-items-from-cart')
    getItemsFromShoppingCart(){
        return this.shoppingCartService.getShoppingCart()
    }

    @Get('get-items-from-temporal-cart')
    getItemsFromTemporalShoppingCart(@Query('idForTemporalCart') idForTemporalCart: string){
        console.log(idForTemporalCart)
        return this.temporalShoppingCartService.getTemporalShoppingCart(idForTemporalCart)
    }
    
    // @UseGuards(RefreshAuthGuard)
    @Post('add')
    addToShoppingCart(@Body() body: any){
        return this.shoppingCartService.addToShoppingCart(body)
    }

    @Post('add-to-merge')
    addToMergeShoppingCart(@Body() body: any){
        return this.shoppingCartService.addToMergeShoppingCart(body)
    }

    // @UseGuards(RefreshAuthGuard)
    @Put('delete/:id')
    delete(@Param('id') id: string){
        return this.shoppingCartService.removeItemFromShoppingCart(id)
    }

    @Put('clear-cart/:id')
    clearcart(@Param('id') id: string){
        return this.shoppingCartService.clearCart(id)
    }

    @Put('delete-item-from-temporal-cart/:id')
    deleteFromTemporalShoppingCart(@Param('id') id: string, @Query('idForTemporalCart') idForTemporalCart: string){
        return this.temporalShoppingCartService.removeItemFromTemporalShoppingCart(id, idForTemporalCart)
    }

    @Delete('delete-entry/:id')
    deleteEntry(@Param('id') id: string){
        return this.shoppingCartService.removeCart(id)
    }

    @Delete('delete-entry-temp-cart/:id')
    deleteEntryFromTemporalCart(@Param('id') id: string){
        return this.temporalShoppingCartService.removeCart(id)
    }

}
