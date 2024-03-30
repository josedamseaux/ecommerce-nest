// import { PurchaseEntity } from "src/purchases/entities/purchase.entity";
import { UsersEntity } from "src/users/entities/users.entity";

export interface IPurchaseBody {
    user?: string;
    total?: number;
    products?: string[];
    purchase?: string,
    status?: string,
    shippingAddress?: string,
    additionalInfo?: string,
}