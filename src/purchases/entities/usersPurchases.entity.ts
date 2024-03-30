import { BaseEntity } from "../../config/base.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { UsersEntity } from "../../users/entities/users.entity";
// import { PurchaseEntity } from "../../purchases/entities/purchase.entity";

@Entity({ name: 'users_purchases' })
export class UsersPurchasesEntity extends BaseEntity {
    // Many purchases to one user
    @ManyToOne(() => UsersEntity, user => user.purchases)
    user: UsersEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total: number;

    @Column({ nullable: true })
    shippingAddress: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    additionalInfo: string;

    @Column({ nullable: true })
    sessionId: string;

    @Column({ type: 'jsonb', nullable: true })
    products: string[]; // Array of product IDs

    @Column({ nullable: true })
    shippingStatus: string;

}