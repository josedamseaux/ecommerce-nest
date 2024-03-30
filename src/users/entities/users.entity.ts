import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { IUser } from "../../interfaces/user.interface";
import { Exclude } from "class-transformer";
import { UsersPurchasesEntity } from "../../purchases/entities/usersPurchases.entity";
import { ShoppingCartEntity } from "../../shoppingCart/entities/shoppingCart.entity";

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    dateOfBirth?: Date;

    @Column({ unique: true })
    email: string;

    // @Column({ unique: true })
    // username: string;

    @Column({ nullable: true })
    gender?: Gender;

    @Exclude()
    @Column()
    password: string;

    @Column({ nullable: true })
    @Exclude()
    refreshToken?: string;

    // relacion de un usuario a muchos purchases
    @OneToMany(() => UsersPurchasesEntity, usersPurchases => usersPurchases.user)
    purchases: UsersPurchasesEntity[];

    // Relación de un usuario a un carrito de compras
    @OneToOne(() => ShoppingCartEntity, shoppingCart => shoppingCart.user)
    shoppingCart: ShoppingCartEntity;
}


enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
  }