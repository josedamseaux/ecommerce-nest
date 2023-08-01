import { Body, Controller, Request , Delete, Get, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { ProductInterface } from '../interfaces/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('products')
export class ProductsController {

  constructor(private readonly productService: ProductsService) { }

  @UseGuards(AccessTokenGuard)
  @UseGuards(AdminGuard)
  @Post('new-product')
  @UseInterceptors(FileInterceptor('file'))
  public async addProduct( @Body() body: ProductInterface, @UploadedFile(new ParseFilePipe({
    validators: [
      // new MaxFileSizeValidator({ maxSize: 5000 }),
      // new FileTypeValidator({ fileType: 'image/jpeg' }),
    ]
  })) file: Express.Multer.File) {
    body.imageData = file.buffer
    return await this.productService.newProduct(body)
  }

  @Get('all')
  public async getProducts() {
    return this.productService.getAllProducts()
  }

  @UseGuards(AdminGuard, AccessTokenGuard)
  @Post('test')
  public async testGuards() {
    console.log('test executed')
    // return this.productService.getAllProducts()
  }

  @Delete('delete/:id')
  deleteTuit(@Param('id') id: any) {
    return this.productService.deleteProduct(id)
  }

  


}


