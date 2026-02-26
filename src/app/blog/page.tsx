"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, MessageSquare } from "lucide-react";

const posts = [
    {
        title: "Introducing Devian: The Control Center for Modern Developers",
        excerpt: "We're excited to announce the public beta of Devian, a unified environment manager building a local intelligence layer for your dev machine.",
        date: "Feb 22, 2026",
        author: "Devian Team",
        slug: "introducing-devian",
    },
    {
        title: "Building a Local AI Intelligence Layer",
        excerpt: "How we use local LLMs to help you understand why port 3000 is blocked and what's eating your RAM.",
        date: "Feb 15, 2026",
        author: "Engineering",
        slug: "local-ai-layer",
    },
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#121212] text-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                        <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Blog</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Home</Link>
            </nav>

            <main className="max-w-4xl mx-auto px-8 py-20">
                <header className="mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Latest Updates</h1>
                    <p className="text-xl text-muted-foreground">News, guides, and engineering logs from the Devian Labs team.</p>
                </header>

                <div className="space-y-12">
                    {posts.map((post, idx) => (
                        <motion.article
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.author}</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
                                <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                                    Read Article <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </main>
        </div>
    );
}
