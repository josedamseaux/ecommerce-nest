import { BaseEntity } from "../../config/base.entity"
import { Entity, ManyToOne } from "typeorm"
import { UsersEntity } from "./users.entity";

@Entity({name: 'users_purchases'})
export class UsersPurchasesEntity extends BaseEntity {
    // Many purchases to one project
    @ManyToOne(() => UsersEntity, user => user.purchases)
    user: UsersEntity;
}