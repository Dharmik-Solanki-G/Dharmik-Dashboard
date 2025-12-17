"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar"; // Reuse logic or simpler version for mobile
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Map, Calendar, CheckSquare, TrendingUp } from "lucide-react";

// Simplified Mobile Navigation
const mobileNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Plan", href: "/planner", icon: Calendar },
    { name: "Map", href: "/roadmap", icon: Map },
    { name: "Stats", href: "/progress", icon: TrendingUp },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Top Bar for Mobile */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4">
                <Link href="/" className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Founder
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950 md:hidden pt-20 px-6">
                    <nav className="space-y-4">
                        {mobileNav.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 py-3 text-lg font-medium text-slate-300 border-b border-slate-800"
                            >
                                <item.icon className="w-6 h-6 text-purple-400" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
