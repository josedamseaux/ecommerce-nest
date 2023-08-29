
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RefreshAuthGuard } from 'src/auth/guards/refreshToken.guard';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { PurchasesService } from 'src/purchases/service/purchases.service';
import { UsersEntity } from 'src/users/entities/users.entity';

const stripeSecretKey = 'sk_test_51NDuBXHWoWZ4ywju7Yx0q26cSP6usJJFgiql73q7mlOXtoOTTffEejIqvbJ11bkefYM1FlIHTDo8Sp5yg9XDQ4bw006qUAzACC';
const stripeInstance = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15', // Puedes especificar la versión de la API de Stripe aquí
}); // Utiliza Stripe como un constructor

@Controller('payments')

  
export class PaymentsController {

    constructor(private purchasesService: PurchasesService) { }

    @UseGuards(RefreshAuthGuard)
    @Post('pay-with-stripe')
    async createCheckoutSession(@Req() req: Request, @Res() res: Response, @Body() data: any) {

        // console.log(data.cartWithUserInfo)

        const lineItems = data.cartWithUserInfo.cart.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.productName,
                    description: item.description,
                    images: [item.imageData], // Agrega la URL de la imagen como elemento en un array
                },
                unit_amount: item.totalAmount * 100,
            },
            quantity: 1,
        }));

        try {
            const session = await stripeInstance.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: 'payment',
                success_url: "http://localhost:4200/payment",
                // success_url: "http://localhost:4200/purchases/new-purchase",
                cancel_url: "http://localhost:4200/cart",
            });

            const customer = await stripeInstance.customers.create({
                name: `${data.cartWithUserInfo.firstName} ${data.cartWithUserInfo.lastName}`,
                email: data.cartWithUserInfo.email,
                // description: 'My first customer',
            });

            // console.log(session.id)

            data.cartWithUserInfo.status = 'NOTPAID'
            data.cartWithUserInfo.sessionId = session.id


            this.purchasesService.createPurchase(data).then((resp: any) => {
                console.log('++++++++++')
                console.log(resp.id)
                console.log('++++++++++')
                // dataResp = resp.id
    
                let dataResp;
    
                const responseObj = {
                    url: session.url,
                    // customerResp: customer,
                    sessionResp: session,
                    resp: resp.id
                };
                console.log(responseObj)

                return res.status(HttpStatus.OK).json(responseObj);
            });
            
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    @Post('get-payment-status')
    async getPaymentStatus(@Body() data: any, @Res() res: Response) {
        const sessionId = data.sessionId;
        const purchaseId = data.purchaseId;
        console.log(data)
        console.log(sessionId)
        try {
            const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
            const paymentStatus = session.payment_status; // Almacena el valor en una variable
            console.log(paymentStatus)
            if (paymentStatus == 'paid') {
                console.log('***************entered if')
                 this.purchasesService.updatePurchaseStatus(purchaseId).then(resp=>{
                    console.log(resp)
                 });
            }
            return res.status(HttpStatus.OK).json({ payment_status: session.payment_status });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


}

interface Purchase {
    user: UsersEntity;
    total: number;
    products: string[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }