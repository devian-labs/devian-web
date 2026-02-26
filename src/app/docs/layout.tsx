"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, BookOpen, Rocket, Box, Network, HardDrive, BrainCircuit } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const sidebarItems = [
    {
        title: "Getting Started",
        icon: Rocket,
        items: [
            { title: "Introduction", href: "/docs" },
            { title: "Installation", href: "/docs/installation" },
        ],
    },
    {
        title: "Core Features",
        icon: Box,
        items: [
            { title: "Project Scanner", href: "/docs/project-scanner" },
            { title: "Port Monitor", href: "/docs/port-monitor" },
            { title: "Docker Adapter", href: "/docs/docker-adapter" },
            { title: "Disk Analyzer", href: "/docs/disk-analyzer" },
        ],
    },
    {
        title: "Advanced",
        icon: BrainCircuit,
        items: [
            { title: "AI Environment Insights", href: "/docs/ai-insights" },
            { title: "One-Click Cleanup", href: "/docs/cleanup" },
        ],
    },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#121212] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 fixed top-0 bottom-0 overflow-y-auto pt-24 px-6 bg-[#121212] hidden md:block">
                <div className="space-y-8">
                    {sidebarItems.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                <section.icon className="h-3 w-3" />
                                {section.title}
                            </h4>
                            <ul className="space-y-2">
                                {section.items.map((item, id) => (
                                    <li key={id}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-white block",
                                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-24 px-8 pb-32">
                <div className="max-w-3xl mx-auto prose prose-invert prose-primary">
                    {children}
                </div>
            </main>

            {/* Basic Navigation Back to Home */}
            <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md z-[60] flex items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Devian Docs</span>
                </Link>
                <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Blog</Link>
            </nav>
        </div>
    );
}
