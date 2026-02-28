import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", {
        apiVersion: "2026-02-25.clover",
    });
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return new NextResponse("Session ID is required", { status: 400 });
    }

    try {
        // Verify the session against Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return new NextResponse("Payment not complete", { status: 400 });
        }

        // Search Keygen for the license matching this Stripe Session ID
        const accountId = process.env.VITE_KEYGEN_ACCOUNT_ID;
        const keygenToken = process.env.KEYGEN_API_TOKEN;

        if (!accountId || !keygenToken) {
            throw new Error("Missing Keygen configuration");
        }

        // Use Keygen's metadata query
        const response = await fetch(`https://api.keygen.sh/v1/accounts/${accountId}/licenses?metadata[stripe_session_id]=${sessionId}`, {
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
        console.error("Failed to resolve session:", e);
        return new NextResponse("Server Error", { status: 500 });
    }
}
