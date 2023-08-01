import { IsOptional } from "class-validator";
import { BaseEntity } from "../../config/base.entity";
import { IProduct } from "../../interfaces/product.interface";
import { Column, Entity } from "typeorm";

@Entity({ name: 'products' })
export class ProductsEntity extends BaseEntity implements IProduct {

    @Column()
    productName: string;

    @Column()
    description: string;

    @Column()
    totalAmount: number;

    @Column()
    quantity: number;

    @IsOptional()
    @Column('bytea', { nullable: true })
    imageData: Buffer;

    // relacion de un usuario a muchos proyectos
    // @ManyToOne(() => UsersEntity, users => users.products)
    // projectsIncludes: UsersProjectsEntity[]
}