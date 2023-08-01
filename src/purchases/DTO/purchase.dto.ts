import { IsNotEmpty, IsString } from "class-validator";

export class PurchaseDTO {

    // User id
    @IsNotEmpty()
    @IsString()
    user: any;

    @IsNotEmpty()
    @IsString()
    total: number;

    @IsNotEmpty()
    @IsString()
    products: string[];
}
