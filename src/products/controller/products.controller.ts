import { Body, Controller, Request, Delete, Get, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { ProductInterface } from '../interfaces/product.interface';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import { CouponsEntity } from '../entities/coupons.entity';

@Controller('products')
export class ProductsController {

  constructor(private readonly productService: ProductsService) { }

  @UseGuards(RefreshAuthGuard)
  @UseGuards(AdminGuard) 
  @Post('new-product')
  @UseInterceptors(AnyFilesInterceptor())
    public async addProduct(@Body() body: ProductInterface, 
    @UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.productService.newProduct(body, files)
  }

  @Get('all')
  public async getProducts() {
    return this.productService.getAllProducts()
  }

  @Get('get-product/:id')
  public async getProductById(@Param('id') id: any) {
    return this.productService.getProductById(id)
  }

  @Delete('delete/:id')
  deleteTuit(@Param('id') id: any) {
    return this.productService.deleteProduct(id)
  }

  // COUPON METHODS

  @UseGuards(RefreshAuthGuard)
  @UseGuards(AdminGuard) 
  @Post('new-coupon')
  public async addCoupon(@Body() body: CouponsEntity) {
    console.log(body.name)
    return await this.productService.newCoupon(body)
  }




}


