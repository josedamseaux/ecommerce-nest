import { Readable } from "typeorm/platform/PlatformTools";

export interface ProductInterface {
    productName: string;
    description: string;
    totalAmount: number;
    quantity: number;
    imageData?: Buffer;
}

export interface filesInterface {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer?: Buffer;
    size: number;
    path: string;
    destination: string;
}
