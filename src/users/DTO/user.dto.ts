import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { UsersEntity } from "../entities/users.entity";
import { ProductsEntity } from "src/products/entities/products.entity";

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    firstName: string;
    
    @IsNotEmpty()
    @IsString()
    lastName: string;
    
    @IsOptional()
    @IsNumber()
    age: number;
    
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;

}

export class UserUpdateDTO {
    @IsOptional()
    @IsString()
    firstName: string;
    
    @IsOptional()
    @IsString()
    lastName: string;
    
    @IsOptional()
    @IsNumber()
    age: number;
    
    @IsOptional()
    @IsString()
    email: string;
    
    @IsOptional()
    @IsString()
    username: string;
    
    @IsOptional()
    @IsString()
    password: string;

}

export class UserPurchasesDTO {
    @IsNotEmpty()
    @IsUUID()
    user: UsersEntity;
    
    @IsNotEmpty()
    @IsUUID()
    purchase: ProductsEntity;
    

}