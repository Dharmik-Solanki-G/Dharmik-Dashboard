"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Calendar, CheckSquare, Settings, LogOut, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Daily Planner", href: "/planner", icon: Calendar },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Habits", href: "/habits", icon: CheckSquare },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl md:block w-64 h-screen fixed left-0 top-0 z-30">
            <div className="flex flex-col h-full">
                <div className="flex h-16 items-center px-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AI Founder
                        </span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                                        isActive
                                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-md shadow-purple-900/10"
                                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-purple-400" : "text-slate-500")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account</p>
                        <Link href="/profile" className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
