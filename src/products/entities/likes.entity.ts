import { UsersEntity } from "../../users/entities/users.entity";
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: 'likes' })
export class LikesEntity extends BaseEntity {

    // Many likes to one user
    @ManyToOne(() => UsersEntity, user => user.purchases)
    user: UsersEntity;

    @Column({ type: 'jsonb', nullable: true })
    products: string[]; // Array of product IDs

}