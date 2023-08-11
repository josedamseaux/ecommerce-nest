import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";
import { UsersPurchasesEntity } from "../../users/entities/usersPurchases.entity";

@Entity({ name: 'purchases' })
export class PurchaseEntity extends BaseEntity {

    @ManyToOne(() => UsersEntity, user => user.purchases)
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'jsonb', nullable: true })
    products: string[]; // Array of product IDs

    @OneToOne(() => UsersPurchasesEntity, usersPurchases => usersPurchases.purchase)
    usersPurchases: UsersPurchasesEntity; 

}