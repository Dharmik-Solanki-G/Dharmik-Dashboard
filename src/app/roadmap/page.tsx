"use client";

import { masterPlan } from "@/lib/data";
import { CheckCircle2, Circle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Strategic Roadmap</h1>
                <p className="text-slate-400 mt-2">The Master Plan: Dec 2025 - Dec 2026</p>
            </div>

            <div className="space-y-12 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800 hidden md:block" />

                {masterPlan.monthlyBreakdown.map((month, idx) => (
                    <div key={idx} className="relative pl-0 md:pl-20">
                        {/* Timeline Node */}
                        <div className="absolute left-[1.15rem] top-6 w-6 h-6 rounded-full border-4 border-slate-900 bg-purple-500 z-10 hidden md:block" />

                        <div className="glass-panel p-6 border-l-4 border-l-purple-500 md:border-l-slate-800 md:border-t-0 hover:border-purple-500 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">{month.name}</h2>
                                    <p className="text-purple-400 font-medium">{month.focus}</p>
                                </div>
                                <div className="px-3 py-1 bg-slate-900 rounded border border-slate-700 text-sm md:text-right">
                                    <p className="text-slate-500 text-xs uppercase">Revenue Target</p>
                                    <p className="text-green-400 font-bold">{month.revenue_target}</p>
                                </div>
                            </div>

                            {/* Weeks Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {month.weeks.map((week) => (
                                    <div key={week.week} className="flex gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                        <div className="mt-1">
                                            {week.status === 'done' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : week.status === 'current' ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-blue-500 animate-pulse" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-slate-700" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-xs font-mono text-slate-500 uppercase">Week {week.week}</span>
                                            <p className={cn("text-sm font-medium", week.status === 'done' ? "text-slate-400 line-through" : "text-slate-200")}>
                                                {week.focus}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="relative pl-0 md:pl-20">
                    <div className="absolute left-[1.15rem] top-6 w-6 h-6 rounded-full border-4 border-slate-900 bg-green-500 z-10 hidden md:block" />
                    <div className="glass-panel p-6 border border-green-900/50 bg-green-900/10">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-green-400">
                            <Flag className="w-5 h-5" />
                            Goal: Dec 16, 2026
                        </h2>
                        <p className="text-slate-300 mt-2">
                            Closing the year with <span className="text-white font-bold">8 Products Live</span> and <span className="text-green-400 font-bold">₹10 Lakh/Month</span> revenue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
