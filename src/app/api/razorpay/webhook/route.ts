import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature") as string;
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

        if (!signature || !webhookSecret) {
            console.error("Missing webhook signature or secret");
            return new NextResponse("Invalid request", { status: 400 });
        }

        // Verify the signature
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Webhook signature verification failed");
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // Parse event
        const event = JSON.parse(body);

        // Handle the order.paid event
        if (event.event === "order.paid") {
            const paymentEntity = event.payload.payment.entity;
            const orderEntity = event.payload.order.entity;

            const customerEmail = paymentEntity.email;
            const paymentId = paymentEntity.id;
            const orderId = orderEntity.id;

            if (!customerEmail) {
                console.error("No customer email found in Razorpay payment data.");
                return new NextResponse("Invalid Session Data", { status: 400 });
            }

            // Create a new license in Keygen
            await createLicenseForKeygen(customerEmail, orderId, paymentId);
        }

        return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
}

// -------------------------------------------------------------
// Core Business Logic
// -------------------------------------------------------------

async function createLicenseForKeygen(email: string, orderId: string, paymentId: string) {
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
                        razorpay_payment_id: paymentId,
                        razorpay_order_id: orderId
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
