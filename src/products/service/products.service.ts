import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../entities/products.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProductInterface } from '../interfaces/product.interface';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) { }

  public async newProduct(body: ProductInterface) {
    await this.productsRepository.save(body)
  }

  public async getAllProducts() {
    const products = await this.productsRepository.find();
    return products
  }

  async getProductById(id: any): Promise<any> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id: id }
      });
      return product
    } catch (error) {
      return error.message
    }
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    try {
      const product: DeleteResult = await this.productsRepository.delete(id)
      if (product.affected == 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró Product'
        })
      } else {
        return product
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }


}
