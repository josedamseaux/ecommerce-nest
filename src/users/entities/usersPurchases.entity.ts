import { BaseEntity } from "../../config/base.entity"
import { Entity, ManyToOne, OneToMany } from "typeorm"
import { UsersEntity } from "./users.entity";
import { PurchaseEntity } from "src/purchases/entities/purchase.entity";

@Entity({name: 'users_purchases'})
export class UsersPurchasesEntity extends BaseEntity {
    // Many purchases to one user
    @ManyToOne(() => UsersEntity, user => user.purchases)
    user: UsersEntity;

}