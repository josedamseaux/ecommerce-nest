import {  IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PurchaseEntity } from "src/purchases/entities/purchase.entity";
import { UsersEntity } from "../entities/users.entity";

export class userPurchasesDTO {
    @IsNotEmpty()
    @IsUUID()
    user_id: UsersEntity;

    @IsNotEmpty()
    @IsUUID()
    purchase_id: PurchaseEntity;

    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsOptional()
    additionalInfo: string;

}

