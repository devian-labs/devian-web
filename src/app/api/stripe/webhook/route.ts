import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";


export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", {
        apiVersion: "2026-02-25.clover", // Adjust to the version you are using
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Handle the checkout session completion
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const paymentIntentId = session.payment_intent as string;

        if (!customerEmail) {
            console.error("No customer email found in session.");
            return new NextResponse("Invalid Session Data", { status: 400 });
        }

        try {
            if (session.payment_status === "paid") {
                // Create a new license in Keygen
                await createLicenseForKeygen(customerEmail, session.id, paymentIntentId);
            }
        } catch (e: any) {
            console.error("Failed to process order:", e);
            // Stripe will retry the webhook if we fail. 
            // In production, we'd log this, potentially to Sentry or PostHog
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}

// -------------------------------------------------------------
// Core Business Logic
// -------------------------------------------------------------

async function createLicenseForKeygen(email: string, sessionId: string, paymentIntentId: string) {
    const accountId = process.env.VITE_KEYGEN_ACCOUNT_ID;
    const policyId = process.env.VITE_KEYGEN_POLICY_ID;
    const keygenToken = process.env.KEYGEN_API_TOKEN;

    if (!accountId || !policyId || !keygenToken) {
        throw new Error("Missing Keygen configuration variables.");
    }

    // Use the undocumented global fetch inside NextJS
    const response = await fetch(`https://api.keygen.sh/v1/accounts/${accountId}/licenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${keygenToken}`
        },
        body: JSON.stringify({
            data: {
                type: 'licenses',
                attributes: {
                    name: email,
                    metadata: {
                        stripe_payment_id: paymentIntentId,
                        stripe_session_id: sessionId
                    }
                },
                relationships: {
                    policy: {
                        data: { type: 'policies', id: policyId }
                    }
                }
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Keygen Error:", data);
        throw new Error(data.errors?.[0]?.detail || "Failed to create license on Keygen");
    }

    // Safely extract the new key
    const licenseKey = data.data.attributes.key;

    if (!licenseKey) {
        throw new Error("License key generation failed!");
    }

    console.log(`Successfully generated license for ${email}`);

    // Send the delivery email via Resend
    await sendDeliveryEmail(email, licenseKey);
}

async function sendDeliveryEmail(email: string, licenseKey: string) {
    const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
    const res = await resend.emails.send({
        from: 'Smruti @ Devian <smruti@devian.app>',
        to: email,
        subject: 'Welcome to Devian Pro! Here is your license key 🚀',
        text: `Hey!

Thank you so much for purchasing Devian Pro. As a solo developer, your support means the world to me and directly funds the future development of the app. 

Here is your lifetime license key (valid for up to 3 devices):
${licenseKey}

How to activate:
1. Open Devian.
2. Go to Settings -> Devian Pro.
3. Paste your key and click Activate.

If you run into any issues, have feature requests, or just want to say hi, reply to this email or reach out to me directly at smruti@devian.app. I read every message!

Happy building,
Smruti`,
    });

    if (res.error) {
        console.error("Failed to send Resend email:", res.error);
        throw new Error("Email delivery failed");
    }

    console.log(`Successfully emailed license to ${email}`);
}
