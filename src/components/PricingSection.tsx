"use client";

import { Check, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";

export function RazorpayButton({
    className = "",
    children,
    disabled = false
}: {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}) {
    const router = useRouter();
    // @ts-ignore
    const { Razorpay } = useRazorpay();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            // 1. Fetch order details from backend
            const orderRes = await fetch('/api/razorpay/order', { method: 'POST' });
            if (!orderRes.ok) {
                throw new Error("Failed to create order");
            }
            const order = await orderRes.json();

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: order.amount,
                currency: order.currency,
                name: "Devian",
                description: "Devian Pro Lifetime License",
                order_id: order.orderId,
                handler: function (response: any) {
                    router.push(`/pricing/success?order_id=${response.razorpay_order_id}`);
                },
                theme: {
                    color: "#0a0a0a"
                }
            };

            const rzp = new Razorpay(options);

            rzp.on("payment.failed", function (response: any) {
                console.error("Payment Failed", response.error);
                setIsProcessing(false);
            });

            rzp.open();

        } catch (error) {
            console.error("Error initiating payment:", error);
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isProcessing || disabled}
            className={className || "w-full text-center py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(101,140,194,0.4)] relative z-10 disabled:opacity-75 disabled:hover:scale-100 flex items-center justify-center gap-2"}
        >
            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : (children || "Buy Devian Pro")}
        </button>
    );
}

export function PricingSection() {
    const [priceData, setPriceData] = useState<{ symbol: string; displayAmount: string } | null>(null);

    useEffect(() => {
        fetch('/api/pricing')
            .then(res => res.json())
            .then(data => {
                setPriceData(data);
            })
            .catch(err => {
                // Fallback to USD on error
                setPriceData({ symbol: '$', displayAmount: '20' });
            });
    }, []);

    return (
        <section id="pricing" className="px-6 md:px-8 py-24 max-w-7xl mx-auto border-t border-white/[0.05]">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Simple, Transparent Pricing</h2>
                <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                    Start for free to organize your local environment. Upgrade to Pro for advanced intelligence and unlimited optimization.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-8 md:p-10 flex flex-col relative overflow-hidden">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2 text-white">Devian Community</h3>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-black text-white">{priceData?.symbol || "$"}0</span>
                            <span className="text-white/40 font-medium">forever</span>
                        </div>
                        <p className="text-white/50 text-sm">Perfect for individual developers looking for a better way to monitor their local machines.</p>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-white/80">Local repository scanning</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-white/80">Active port monitoring</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-white/80">Basic Docker status & containers</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-white/80">One-by-one dependency folder cleanup</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-white/80">100% telemetry-free</span>
                        </li>
                    </ul>

                    <a href="#download" className="w-full text-center py-4 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-white font-semibold transition-colors">
                        Download Free
                    </a>
                </div>

                {/* Pro Tier */}
                <div className="bg-primary/[0.05] border border-primary/20 rounded-[24px] p-8 md:p-10 flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(101,140,194,0.1)]">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />

                    <div className="absolute top-4 right-4 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        One-time payment
                    </div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" /> Devian Pro
                        </h3>
                        <div className="flex items-baseline gap-2 mb-4">
                            {priceData ? (
                                <>
                                    <span className="text-4xl font-black text-white">{priceData.symbol}{priceData.displayAmount}</span>
                                    <span className="text-white/40 font-medium">one-time</span>
                                </>
                            ) : (
                                <div className="h-10 w-24 bg-white/5 rounded animate-pulse" />
                            )}
                        </div>
                        <p className="text-primary/80 text-sm">Professional tools for power users. Own your license forever with no subscriptions.</p>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1 relative z-10">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-white/90">Everything in Community</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-white/90 font-medium">Bulk cleanup of node_modules</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-white/90 font-medium">Smart unused repository insights</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-white/90 font-medium">Advanced project health analytics</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-white/90 font-medium">Up to 3 devices per license</span>
                        </li>
                    </ul>

                    {/* Razorpay Checkout Button */}
                    <RazorpayButton />

                    <div className="mt-4 text-center text-xs text-white/40 flex items-center justify-center gap-1.5 relative z-10">
                        <ShieldCheck className="w-3.5 h-3.5" /> 14-day money-back guarantee. No accounts required.
                    </div>
                </div>
            </div>
        </section>
    );
}
