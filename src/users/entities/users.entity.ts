import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { IUser } from "../../interfaces/user.interface";
import { Exclude } from "class-transformer";
import { UsersPurchasesEntity } from "./usersPurchases.entity";

@Entity({name: 'users'})
export class UsersEntity extends BaseEntity implements IUser{

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column({unique:true})
    email: string;

    @Column({unique:true})
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({nullable: true})
    @Exclude()
    refreshToken?: string;

    // relacion de un usuario a muchos purchases
    @OneToMany(() => UsersPurchasesEntity, usersPurchases => usersPurchases.user)
    purchases: UsersPurchasesEntity[];

}