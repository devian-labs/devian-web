import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import pricingConfig from '@/config/pricing.json';

type PricingConfigType = {
    [key: string]: {
        amount: number;
        currency: string;
        symbol: string;
        displayAmount: string;
    };
};

export async function POST(req: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        });

        const country = req.headers.get('x-vercel-ip-country') || process.env.TEST_COUNTRY_CODE || 'US';

        const config = pricingConfig as PricingConfigType;
        const pricing = config[country] || config['US'];

        const options = {
            amount: pricing.amount,
            currency: pricing.currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
