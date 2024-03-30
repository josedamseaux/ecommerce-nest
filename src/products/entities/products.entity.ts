import { IsOptional } from "class-validator";
import { BaseEntity } from "../../config/base.entity";
import { IProduct } from "../../interfaces/product.interface";
import { Column, Entity, OneToMany } from "typeorm";
import { ImagesEntity } from "./images.entity";

@Entity({ name: 'products' })
export class ProductsEntity extends BaseEntity implements IProduct {

    @Column()
    productName: string;

    @Column()
    description: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 }) // Campo para el precio con precisión de 10 dígitos y 2 decimales
    price: number;

    @Column()
    quantity: number;

    // @IsOptional()
    // @Column('bytea', { nullable: true })
    // imageData: Buffer;

    @OneToMany(() => ImagesEntity, image => image.product)
    images: ImagesEntity[];
}