import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        });

        const country = req.headers.get('x-vercel-ip-country') || process.env.TEST_COUNTRY_CODE || 'US';

        // Pricing logic
        let amount = 2000; // $20.00 USD (in cents)
        let currency = 'USD';

        if (country === 'IN') {
            amount = 120000; // ₹1200.00 INR (in paise)
            currency = 'INR';
        }

        const options = {
            amount,
            currency,
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
