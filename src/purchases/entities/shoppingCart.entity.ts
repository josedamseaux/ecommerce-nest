import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";
import { ProductsEntity } from "../../products/entities/products.entity"; // Cambiar por la entidad de productos si es diferente

@Entity({ name: 'shopping_cart' })
export class ShoppingCartEntity extends BaseEntity {

    @ManyToOne(() => UsersEntity, user => user.shoppingCart)
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;

    @Column({ type: 'jsonb', nullable: true })
    items: ShoppingCartItem[]; // Array of shopping cart items

}

interface ShoppingCartItem {
    product: ProductsEntity; // Cambiar por el tipo de entidad de productos si es diferente
    quantity: number;
}