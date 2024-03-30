    import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
    import { BaseEntity } from "../../config/base.entity";
    import { ProductsEntity } from "../../products/entities/products.entity"; // Cambiar por la entidad de productos si es diferente

    @Entity({ name: 'temporal_shopping_cart' })
    @Unique(["idCookie"]) // Definir el campo idCookie como único
    export class TemporalShoppingCartEntity extends BaseEntity {

        @Column()
        idCookie: string;

        @Column({ type: 'jsonb', nullable: true })
        items: ShoppingCartItem[];
    }

    interface ShoppingCartItem {
        product: ProductsEntity;
        quantity: number;
    }