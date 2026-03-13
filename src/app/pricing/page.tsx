"use client";

import { CheckCircle2, ShieldAlert, Check, X, ArrowRight, Zap, Crown, Bot, Database, FolderGit2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { RazorpayButton } from "@/components/PricingSection";
import { useState, useEffect } from "react";

// Moved metadata to layout.tsx or a separate server component if needed since this is now a client component.
// Or we can just remove it for now if next.js complains, but usually it must be in a server component.

const FEATURES = [
    {
        category: "System & Infrastructure",
        items: [
            { name: "System monitoring", community: true, pro: true },
            { name: "Process manager", community: true, pro: true },
            { name: "Port monitor", community: true, pro: true },
            { name: "Docker viewer", community: true, pro: true },
            { name: "Docker cleanup tools", community: false, pro: true },
            { name: "Smart cleanup", community: false, pro: true },
        ]
    },
    {
        category: "Workspace & Version Control",
        items: [
            { name: "Project discovery", community: true, pro: true },
            { name: "Script runner", community: true, pro: true },
            { name: "Git basic operations", community: true, pro: true },
            { name: "Advanced git tools", community: false, pro: true },
            { name: "Dev environment insights", community: false, pro: true },
        ]
    },
    {
        category: "Search & Intelligence",
        items: [
            { name: "Global search", community: true, pro: true },
            { name: "AI chat", community: true, pro: true },
            { name: "Repository indexing (max 3)", community: true, pro: true },
            { name: "Unlimited repo indexing", community: false, pro: true },
            { name: "AI explanations", community: false, pro: true },
            { name: "Dependency auto fixes", community: false, pro: true },
            { name: "Repo content search", community: false, pro: true },
        ]
    }
];

export default function FeaturesPage() {
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
        <div className="min-h-screen bg-[#121212] text-white selection:bg-primary/30">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(101,140,194,0.3)]">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Devian</span>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70 tracking-wide">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <RazorpayButton className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-[0_0_10px_rgba(101,140,194,0.1)] text-sm" />
                </div>
            </nav>

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        Choose the right plan for your <span className="text-primary">workflow</span>
                    </h1>
                    <p className="text-zinc-400 text-lg sm:text-xl">
                        Devian Community is free forever for basic environment management. Upgrade to Devian Pro to unlock AI agents, bulk cleanup, and advanced docker insights.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Community</h3>
                        <div className="text-4xl font-bold mb-6">{priceData?.symbol || "$"}0<span className="text-lg text-zinc-500 font-normal">/forever</span></div>
                        <p className="text-zinc-400 mb-8 flex-1">
                            Perfect for students and hobbyists who need a better way to view their local stack.
                        </p>
                        <Link href="/downloads" className="w-full text-center py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors">
                            Download Free
                        </Link>
                    </div>

                    <div className="bg-gradient-to-b from-primary/10 to-zinc-900/50 border border-primary/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Crown className="w-24 h-24 text-primary" />
                        </div>
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            SUPPORT INDIE DEV
                        </div>

                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            Devian Pro <Zap className="w-5 h-5 text-primary" />
                        </h3>
                        <div className="text-4xl font-bold mb-6 flex items-baseline gap-2">
                            {priceData ? (
                                <>
                                    {priceData.symbol}{priceData.displayAmount}
                                    <span className="text-lg text-zinc-500 font-normal">/lifetime</span>
                                </>
                            ) : (
                                <div className="h-10 w-24 bg-zinc-800 rounded animate-pulse" />
                            )}
                        </div>
                        <p className="text-zinc-400 mb-8 flex-1 relative z-10">
                            For professional developers who want absolute control, intelligent insights, and AI automation.
                        </p>
                        <RazorpayButton
                            className="w-full text-center py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/30 relative z-10"
                        />
                        <p className="text-center text-xs text-zinc-500 mt-3 relative z-10">Valid for up to 3 personal devices</p>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Detailed Comparison</h2>

                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-5 p-4 bg-zinc-900/80 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
                            <div className="col-span-3">Feature</div>
                            <div className="text-center">Community</div>
                            <div className="text-center text-primary">Pro</div>
                        </div>

                        {FEATURES.map((category, i) => (
                            <div key={i}>
                                <div className="bg-zinc-900/40 px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50">
                                    {category.category}
                                </div>
                                {category.items.map((item, j) => (
                                    <div key={j} className="grid grid-cols-5 p-4 border-b border-zinc-800/30 text-sm hover:bg-zinc-800/20 transition-colors">
                                        <div className="col-span-3 text-zinc-300 flex items-center gap-2">
                                            {item.name}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {item.community ? (
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <span className="w-4 h-px bg-zinc-700" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {item.pro ? (
                                                <Check className="w-4 h-4 text-primary" />
                                            ) : (
                                                <span className="w-4 h-px bg-zinc-700" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center max-w-2xl mx-auto bg-gradient-to-b from-primary/10 to-transparent p-12 rounded-3xl border border-primary/20">
                    <h2 className="text-3xl font-bold mb-4">Ready to supercharge your workflow?</h2>
                    <p className="text-zinc-400 mb-8">
                        Join other professional developers building faster with Devian Pro. One-time payment, lifetime updates.
                    </p>
                    <RazorpayButton
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all hover:scale-105 shadow-[0_0_40px_-10px_var(--tw-shadow-color)] shadow-primary"
                    >
                        Get Devian Pro Today
                    </RazorpayButton>
                </div>
            </main>
        </div>
    );
}
