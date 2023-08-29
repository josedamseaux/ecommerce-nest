import { BaseEntity } from "../../config/base.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { UsersEntity } from "./users.entity";
import { PurchaseEntity } from "../../purchases/entities/purchase.entity";

@Entity({ name: 'users_purchases' })
export class UsersPurchasesEntity extends BaseEntity {
    // Many purchases to one user
    @ManyToOne(() => UsersEntity, user => user.purchases)
    user: UsersEntity;

    // Agregar esta anotación en la propiedad user, no en purchase
    @JoinColumn({ name: 'purchase_id' })
    @OneToOne(() => PurchaseEntity, purchase => purchase.usersPurchases)
    purchase: PurchaseEntity;

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

}