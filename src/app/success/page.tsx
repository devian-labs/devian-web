"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Key, Loader2, Download, AlertCircle } from "lucide-react";
import Link from "next/link";
import pkgData from "../../../package.json";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [licenseKey, setLicenseKey] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        // Poll for the license key every 2 seconds, max 10 tries
        let attempts = 0;
        const maxAttempts = 10;
        let timeoutId: NodeJS.Timeout;

        const fetchLicense = async () => {
            try {
                const res = await fetch(`/api/license/generate?session_id=${sessionId}`);
                if (!res.ok) throw new Error("Could not fetch license");

                const data = await res.json();

                if (data.pending) {
                    if (attempts < maxAttempts) {
                        attempts++;
                        timeoutId = setTimeout(fetchLicense, 2000);
                    } else {
                        setStatus("error");
                    }
                } else {
                    setLicenseKey(data.licenseKey);
                    setEmail(data.email);
                    setStatus("success");
                }
            } catch (err) {
                setStatus("error");
            }
        };

        fetchLicense();

        return () => clearTimeout(timeoutId);
    }, [sessionId]);

    const handleCopy = () => {
        if (licenseKey) {
            navigator.clipboard.writeText(licenseKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <div className="text-center text-white/60">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    No session ID provided.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-primary/30">

            {/* Background Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 items-center justify-center flex mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Payment Successful</h1>
                    <p className="text-white/50">Thank you for supporting Devian! Your Pro account is ready.</p>
                </div>

                <div className="bg-[#1c1c1e] border border-white/10 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px]" />

                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <Key className="w-4 h-4 text-primary" />
                        Your License Key
                    </h3>

                    {status === "loading" && (
                        <div className="flex flex-col items-center justify-center py-8 text-white/50">
                            <Loader2 className="w-6 h-6 animate-spin mb-3 text-primary" />
                            <p className="text-sm">Generating your lifetime key from Keygen...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-red-400/80">
                            <AlertCircle className="w-6 h-6 mb-3" />
                            <p className="text-sm">We couldn't retrieve your key immediately. Don't worry, it has been emailed to you!</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-6">
                            <div
                                onClick={handleCopy}
                                className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 group hover:border-white/10 transition-colors cursor-pointer w-full overflow-hidden"
                                title="Click to copy license key"
                            >
                                <code className="text-primary font-mono text-sm sm:text-base tracking-wider font-bold select-none whitespace-nowrap overflow-x-auto overflow-y-hidden hide-scrollbar flex-1 text-left min-w-0 hide-scrollbar pb-1">
                                    {licenseKey}
                                </code>
                                <div className="w-10 h-10 shrink-0 bg-white/5 group-hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-white/70 group-hover:text-white relative z-10">
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </div>
                            </div>

                            <div className="text-xs text-white/40 text-center">
                                A copy of this key has also been sent to <span className="text-white/70 font-medium">{email}</span>.
                            </div>
                        </div>
                    )}
                </div>

                {/* Next Steps */}
                <div className="mt-8 space-y-4">
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-widest text-center mb-4">Next Steps</h4>

                    <a
                        href={`/downloads/v${pkgData.version}/Devian.Desktop_${pkgData.version}_aarch64.dmg`}
                        className="w-full bg-white text-black font-bold flex items-center justify-center gap-2 py-4 rounded-xl hover:bg-white/90 transition-colors"
                        download
                    >
                        <Download className="w-5 h-5" />
                        Download Devian Desktop
                    </a>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/60 text-center leading-relaxed">
                        Open Devian, click on the <strong className="text-white">Settings</strong> gear, navigate to <strong>Devian Pro</strong>, and paste your license key to unlock to all features.
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-white/30">
                    <Link href="/" className="hover:text-white/70 transition-colors underline underline-offset-4">Return Home</Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
