import { NextResponse } from 'next/server';
import pricingConfig from '@/config/pricing.json';

export const dynamic = 'force-dynamic';

type PricingConfigType = {
    [key: string]: {
        amount: number;
        currency: string;
        symbol: string;
        displayAmount: string;
    };
};

export async function GET(req: Request) {
    const country = req.headers.get('x-vercel-ip-country') || process.env.TEST_COUNTRY_CODE || 'US';

    const config = pricingConfig as PricingConfigType;
    const pricing = config[country] || config['US'];

    return NextResponse.json({
        ...pricing,
        country
    });
}
