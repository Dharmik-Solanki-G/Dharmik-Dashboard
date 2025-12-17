"use client";

import { CheckSquare } from "lucide-react";

const habits = [
    "5 Hours Deep Work",
    "Post on Instagram",
    "Post on LinkedIn/Twitter",
    "Workout (45m+)",
    "No Sugar / Clean Diet",
    "Read 10 Pages",
    "Plan Tomorrow"
];

export default function HabitsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Habit Tracker</h1>
                <p className="text-slate-400 mt-2">Build the system, and the goal will handle itself.</p>
            </div>

            <div className="glass-panel p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Today's Targets</h2>
                    <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="space-y-4">
                    {habits.map((habit, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group">
                            <div className="w-6 h-6 rounded border-2 border-slate-600 group-hover:border-purple-500 transition-colors flex items-center justify-center">
                                {/* Checkbox state logic pending Supabase */}
                            </div>
                            <span className="text-lg text-slate-300 group-hover:text-white transition-colors font-medium">{habit}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-500 mb-4">Completed 0/7 habits today</p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[0%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
