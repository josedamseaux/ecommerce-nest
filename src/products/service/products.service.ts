import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../entities/products.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProductInterface, filesInterface } from '../interfaces/product.interface';
import { ErrorManager } from 'src/utils/error.manager';
import { CouponsEntity } from '../entities/coupons.entity';
import { ImagesEntity } from '../entities/images.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
    @InjectRepository(CouponsEntity)
    private readonly couponRepository: Repository<CouponsEntity>,
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>
  ) { }

  public async newProduct(body: ProductInterface, files: any[]) {

    let product = await this.productsRepository.save(body);

    let imgToBeSaved: any = {
      product: product.id,  
      imageData1: files[0] ? files[0].buffer : null,
      imageData2: files[1] ? files[1].buffer : null,
      imageData3: files[2] ? files[2].buffer : null,
      imageData4: files[3] ? files[3].buffer : null,
      imageData5: files[4] ? files[4].buffer : null,
      imageData6: files[5] ? files[5].buffer : null,
    };

    await this.imagesRepository.save(imgToBeSaved);
  }


  public async getAllProducts() {
    const productWithImages: any = await this.imagesRepository.createQueryBuilder('image')
      .leftJoinAndSelect('image.product', 'product') // Cargar la relación product
      .execute();
      
    return productWithImages
  }

  public async getProductById(id: string) {
    const productWithImages:any[] = await this.imagesRepository.createQueryBuilder('image')
      .leftJoinAndSelect('image.product', 'product')
      .where('product.id = :id', { id: id }) // Cargar la relación product
      .execute();
    return productWithImages
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

  // COUPON METHODS
  public async newCoupon(coupon: any) {
    let couponResult = await this.couponRepository.save(coupon)
    return couponResult
  }


}

export interface ICoupon {
  name: string,
  code: string,
  discountPercentage: number, // Porcentaje de descuento
  discountAmount: number, // Monto del descuento
  maxUsesPerUser: number, // Límite de usos por usuario
  isActive: boolean, // Estado del cupón: activo o inactivo
  eligibleProducts: [], // Productos específicos elegibles para el descuento
  expirationDate: string,// Fecha de expiración del cupón
  uses: number
};
