"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [licenseData, setLicenseData] = useState<{ key: string; email: string } | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!orderId) {
            setStatus("error");
            setErrorMsg("No order ID found.");
            return;
        }

        let attempts = 0;
        const maxAttempts = 20; // Try for ~40 seconds

        const pollLicense = async () => {
            try {
                const res = await fetch(`/api/license/generate?order_id=${orderId}`);
                if (!res.ok) {
                    throw new Error("Failed to check license status");
                }

                const data = await res.json();

                if (data.pending) {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        setStatus("error");
                        setErrorMsg("License generation is taking longer than expected. Please check your email inbox shortly.");
                    } else {
                        // Poll again
                        setTimeout(pollLicense, 2000);
                    }
                } else {
                    // Success!
                    setLicenseData({
                        key: data.licenseKey,
                        email: data.email
                    });
                    setStatus("success");
                }
            } catch (err: any) {
                console.error("Polling error:", err);
                setStatus("error");
                setErrorMsg(err.message || "An error occurred while fetching your license.");
            }
        };

        pollLicense();

    }, [orderId]);

    const copyToClipboard = async () => {
        if (licenseData?.key) {
            await navigator.clipboard.writeText(licenseData.key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/10 blur-[50px] pointer-events-none" />

                {status === "loading" && (
                    <div className="text-center py-8">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-3">Processing Payment</h2>
                        <p className="text-zinc-400">
                            Please wait while we secure your payment and generate your lifetime license key.
                            This usually takes a few seconds.
                        </p>
                    </div>
                )}

                {status === "success" && licenseData && (
                    <div className="text-center animate-fade-in relative z-10">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">Welcome to Devian Pro!</h2>
                        <p className="text-zinc-400 mb-8">
                            Thank you for your purchase. We've also emailed these details to <span className="text-white font-medium">{licenseData.email}</span>.
                        </p>

                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-8 text-left group">
                            <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Your License Key</p>
                            <div className="flex items-center gap-3">
                                <code className="flex-1 text-primary font-mono text-sm break-all">
                                    {licenseData.key}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Link
                            href="/downloads"
                            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(101,140,194,0.3)] hover:shadow-[0_0_30px_rgba(101,140,194,0.5)]"
                        >
                            Download Devian
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center py-8 relative z-10">
                        <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-rose-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Something isn't right</h2>
                        <p className="text-zinc-400 mb-8">
                            {errorMsg}
                        </p>
                        <p className="text-sm text-zinc-500 mb-8">
                            If you were charged, please contact <a href="mailto:smruti@devian.app" className="text-primary hover:underline">smruti@devian.app</a> with your order details and we'll sort it out immediately.
                        </p>
                        <Link
                            href="/"
                            className="inline-block py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
