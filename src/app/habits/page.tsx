"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Check } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
    const [habits, setHabits] = useState<any[]>([]);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [habitsData, logsData] = await Promise.all([
                api.getHabits(),
                api.getHabitLogs()
            ]);
            setHabits(habitsData);
            setCompletedHabits(logsData);
        } catch (e) {
            console.error("Failed to load habits", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggle(id: string) {
        const isCompleted = completedHabits.includes(id);
        try {
            await api.toggleHabit(id, !isCompleted);
            if (isCompleted) {
                setCompletedHabits(prev => prev.filter(h => h !== id));
            } else {
                setCompletedHabits(prev => [...prev, id]);
            }
        } catch (e) {
            console.error("Failed to toggle habit", e);
        }
    }

    if (loading) return <div className="text-slate-500 p-8">Loading Habits...</div>;

    const progress = habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0;

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
                    {habits.map((habit) => {
                        const isDone = completedHabits.includes(habit.id);
                        return (
                            <div key={habit.id}
                                onClick={() => handleToggle(habit.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group select-none",
                                    isDone ? "bg-purple-900/20 border-purple-500/50" : "bg-slate-900/40 border-slate-800 hover:border-purple-500/50"
                                )}>
                                <div className={cn(
                                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                                    isDone ? "bg-purple-500 border-purple-500" : "border-slate-600 group-hover:border-purple-500"
                                )}>
                                    {isDone && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={cn("text-lg font-medium transition-colors", isDone ? "text-white" : "text-slate-300 group-hover:text-white")}>
                                    {habit.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-500 mb-4">Completed {completedHabits.length}/{habits.length} habits today</p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
