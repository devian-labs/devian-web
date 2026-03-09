import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
        return new NextResponse("Order ID is required", { status: 400 });
    }

    try {
        // Search Keygen for the license matching this Razorpay Order ID
        const accountId = process.env.VITE_KEYGEN_ACCOUNT_ID;
        const keygenToken = process.env.KEYGEN_API_TOKEN;

        if (!accountId || !keygenToken) {
            throw new Error("Missing Keygen configuration");
        }

        // Use Keygen's metadata query
        const response = await fetch(`https://api.keygen.sh/v1/accounts/${accountId}/licenses?metadata[razorpay_order_id]=${orderId}`, {
            headers: {
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${keygenToken}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.data || data.data.length === 0) {
            // License might still be generating or failed.
            return NextResponse.json({ pending: true }, { status: 200 });
        }

        // Got the license!
        const licenseKey = data.data[0].attributes.key;
        const email = data.data[0].attributes.name;

        return NextResponse.json({
            pending: false,
            licenseKey,
            email
        });

    } catch (e: any) {
        console.error("Failed to resolve order:", e);
        return new NextResponse("Server Error", { status: 500 });
    }
}
