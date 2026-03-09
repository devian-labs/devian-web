import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const country = req.headers.get('x-vercel-ip-country') || process.env.TEST_COUNTRY_CODE || 'US';

    let amount = 2000;
    let currency = 'USD';
    let symbol = '$';
    let displayAmount = '20';

    if (country === 'IN') {
        amount = 120000;
        currency = 'INR';
        symbol = '₹';
        displayAmount = '1,200';
    }

    return NextResponse.json({
        amount,
        currency,
        symbol,
        displayAmount,
        country
    });
}
