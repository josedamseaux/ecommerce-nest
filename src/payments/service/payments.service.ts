import { Injectable } from '@nestjs/common';
import { PaymentRequestBody } from '../types/PaymentRequestBody';
import { Stripe, loadStripe } from '@stripe/stripe-js';

@Injectable()
export class PaymentsService {


    constructor() {
        this.configureStripeClient();
    }

    stripe = require('stripe')('sk_test_51NDuBXHWoWZ4ywju7Yx0q26cSP6usJJFgiql73q7mlOXtoOTTffEejIqvbJ11bkefYM1FlIHTDo8Sp5yg9XDQ4bw006qUAzACC');

    async configureStripeClient() {
        this.stripe = await loadStripe(process.env.stripePublicKey);
    }

    async createCheckoutSession(cartItems: any) {
        try {
            console.log(cartItems)
            const lineItems = cartItems.cart.map((item) => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        images: [item.imgUrl], // Agrega la URL de la imagen como elemento en un array
                        mail: item.email,
                    },
                    unit_amount: item.totalAmount,
                },
                quantity: item.quantity,
            }));

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                invoice_creation: {
                    enabled: true,
                },
                phone_number_collection: {
                    enabled: true,
                },
                line_items: lineItems,
                mode: 'payment',
                success_url: 'https://tu-app.com/pago-completado', // Reemplaza con la URL de éxito en tu aplicación
                cancel_url: 'https://tu-app.com/pago-cancelado', // Reemplaza con la URL de cancelación en tu aplicación
            });

            return session

        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }




}