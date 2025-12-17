"use client";

import { masterPlan } from "@/lib/data";
import { Clock, Plus, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Daily Planner</h1>
                    <p className="text-slate-400 mt-1">Founders don't find time, they make it.</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Schedule Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Time Boxing
                    </h2>

                    <div className="space-y-2">
                        {masterPlan.dailySchedule.map((slot, idx) => (
                            <div key={idx} className={cn(
                                "p-4 rounded-lg border flex flex-col md:flex-row md:items-center gap-4 transition-all hover:scale-[1.01]",
                                slot.type === 'build' ? "bg-purple-900/20 border-purple-500/30" :
                                    slot.type === 'job' ? "bg-slate-800/50 border-slate-700" :
                                        slot.type === 'health' ? "bg-green-900/10 border-green-900/30" :
                                            "bg-slate-900/30 border-slate-800"
                            )}>
                                <div className="w-20 font-mono text-sm text-slate-400">{slot.time}</div>
                                <div className="flex-1">
                                    <p className="font-medium text-white">{slot.activity}</p>
                                    <span className="text-xs uppercase tracking-wider text-slate-500">{slot.type}</span>
                                </div>
                                {/* Status Indicator (Mock) */}
                                <div className="w-4 h-4 rounded-full border border-slate-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks / Habits Column */}
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-green-400" />
                            Top 3 Priorities
                        </h2>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Priority #${i} for today...`}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h2 className="text-lg font-semibold mb-4">Focus Mode</h2>
                        <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-lg">
                            <p className="text-2xl font-bold font-mono text-white">00:00</p>
                            <p className="text-slate-500 text-sm mt-1">Ready to start Deep Work?</p>
                            <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
                                Start Timer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
