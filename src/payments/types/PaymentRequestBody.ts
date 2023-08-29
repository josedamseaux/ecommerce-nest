import { ProductInterface } from 'src/products/interfaces/product.interface';
import { IProduct } from './Product';

export interface PaymentRequestBody {
  products: ProductInterface[];
  currency: string;
}