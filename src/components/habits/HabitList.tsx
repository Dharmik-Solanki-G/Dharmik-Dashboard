import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { api, Habit, HabitLog } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HabitListProps {
    habits: Habit[];
    logs: HabitLog[];
    onToggle: (habitId: string, date: string, currentValue: number) => void;
    onDelete: (habitId: string) => void;
}

export function HabitList({ habits, logs, onToggle, onDelete }: HabitListProps) {
    // We show a 7-day or 5-day sliding window for the mini-calendar
    const [viewDate, setViewDate] = useState(new Date());

    // Generate array of dates to show (e.g., last 4 days + today + next 2 days)
    const datesToShow = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() - 3 + i);
        return d;
    });

    function getLog(habitId: string, date: Date) {
        const dateStr = date.toISOString().split('T')[0];
        return logs.find(l => l.habit_id === habitId && l.date === dateStr);
    }

    return (
        <div className="glass-panel p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-6 min-w-[600px]">
                <h3 className="text-lg font-semibold text-white">Active Habits</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => {
                        const d = new Date(viewDate);
                        d.setDate(d.getDate() - 7);
                        setViewDate(d);
                    }} className="p-1 hover:bg-slate-800 rounded">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <span className="text-sm font-medium text-slate-300 w-32 text-center">
                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => {
                        const d = new Date(viewDate);
                        d.setDate(d.getDate() + 7);
                        setViewDate(d);
                    }} className="p-1 hover:bg-slate-800 rounded">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="min-w-[600px]">
                {/* Header Row */}
                <div className="grid grid-cols-[250px_1fr] gap-4 mb-4 border-b border-slate-700 pb-2">
                    <div className="text-sm font-medium text-slate-400">Habit</div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {datesToShow.map(date => {
                            const isToday = date.toDateString() === new Date().toDateString();
                            return (
                                <div key={date.toISOString()} className={cn("flex flex-col items-center", isToday && "text-purple-400")}>
                                    <span className="text-xs uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className={cn("text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full", isToday && "bg-purple-500/20")}>
                                        {date.getDate()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Habit Rows */}
                <div className="space-y-2">
                    {habits.map(habit => (
                        <div key={habit.id} className="grid grid-cols-[250px_1fr] gap-4 items-center p-3 hover:bg-slate-800/30 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{habit.icon || "✨"}</span>
                                <div className="min-w-0">
                                    <p className="font-medium text-white truncate">{habit.title}</p>
                                    <p className="text-xs text-slate-400 truncate">{habit.target_value} {habit.unit}/{habit.goal_frequency}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm("Delete this habit?")) onDelete(habit.id);
                                    }}
                                    className="ml-auto opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {datesToShow.map(date => {
                                    const log = getLog(habit.id, date);
                                    const isCompleted = log?.completed || false;
                                    const dateStr = date.toISOString().split('T')[0];

                                    return (
                                        <div key={dateStr} className="flex justify-center">
                                            <button
                                                onClick={() => onToggle(habit.id, dateStr, log?.value || 0)}
                                                className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                                                    isCompleted
                                                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                                        : "bg-slate-900/50 border-slate-700 text-transparent hover:border-purple-500/50"
                                                )}
                                            >
                                                <Check className={cn("w-5 h-5 transition-transform", isCompleted ? "scale-100" : "scale-0")} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {habits.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No habits yet. Click "Add Habit" to start!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
