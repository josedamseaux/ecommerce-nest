import { UsersEntity } from "src/users/entities/users.entity";

export interface IPurchase {
    user: UsersEntity;
    total: number;
    products: string[];
}