import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";

@Entity({ name: 'purchases' })
export class PurchaseEntity extends BaseEntity {

    // @ManyToOne(()=> UsersEntity, user => user.purchases)
    // @JoinColumn({
    //     name:'users_purchases_id',
    // })
    // usersPurchases: UsersPurchasesEntity;

    @ManyToOne(() => UsersEntity, user => user.purchases)
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'jsonb', nullable: true })
    products: string[]; // Array of product IDs

}