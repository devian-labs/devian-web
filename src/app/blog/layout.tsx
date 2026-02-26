"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#121212] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md z-[60] flex items-center justify-between px-8">
                <Link href="/blog" className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Devian Blog</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Home</Link>
            </nav>

            <main className="max-w-3xl mx-auto pt-32 px-8 pb-32">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-all mb-12">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                <div className="prose prose-invert prose-primary max-w-none">
                    {children}
                </div>
            </main>
        </div>
    );
}
