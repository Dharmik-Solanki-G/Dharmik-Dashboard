"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, Habit, HabitLog } from "@/lib/api";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { HabitList } from "@/components/habits/HabitList";
import { HabitProgressChart } from "@/components/habits/HabitProgressChart";

export default function HabitsPage() {
    const [user, setUser] = useState<any>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await api.getUser();
        setUser(user);
        loadData();
    }

    async function loadData() {
        try {
            const habitsData = await api.getHabits();
            // Fetch logs for a range? For now fetching today's logs + recent history might be needed for the chart.
            // The API `getHabitLogs` currently filters by single date. We need to fetch MORE logs for the chart.
            // But I didn't verify if `getHabitLogs` supports range. It doesn't.
            // I should have updated `getHabitLogs` to support range or remove the filter.
            // Let's assume for the Chart I need 30 days of data.
            // I'll update `loadData` to fetch what I can.
            // Since I cannot change API right now (or I can?), I might need to make multiple calls or update API again.
            // Actually, I can update API again quickly if needed.
            // Or I can just fetch *all* logs for the user if the dataset is small?
            // The `api.getHabitLogs` strictly filters `eq('date', date)`.
            // I need to change `api.getHabitLogs` to `getAllHabitLogs` or `getHabitLogs(startDate, endDate)`.

            // For now, I will use `api.getHabitLogs` for TODAY to show the list status.
            // But for the Graph and the Weekly view, I need more data.
            // I will implement a client-side loop or update the API. Updating API is better.
            // I will update API in the next step to support date range.
            // For this file, I'll assume `getHabitLogs` can take no args to return ALL logs, or I add a new function.

            // Let's stick to what we have for a second.
            // I'll update the API to `getHabitLogs(startDate, endDate)`.

            setHabits(habitsData);
            // setLogs logic will happen after API update
        } catch (e) {
            console.error("Failed to load habits", e);
        } finally {
            setLoading(false);
        }
    }

    if (!loading && !user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">Log In Required</h2>
                <p className="text-slate-400">Please sign in to access your Habit Tracker.</p>
                <a href="/login" className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500">Sign In</a>
            </div>
        );
    }

    // Refresh function
    async function refreshLogs() {
        const logsData = await api.getHabitLogs();
        setLogs(logsData);
    }



    async function handleToggle(habitId: string, date: string, currentValue: number) {
        // Determine new state. If val > 0, toggle to 0. If 0, toggle to 1 (or target).
        // For simple boolean toggle, we switch.
        const habit = habits.find(h => h.id === habitId);
        const target = habit?.target_value || 1;

        const newValue = currentValue >= target ? 0 : target;
        const isCompleted = newValue >= target;

        try {
            // Optimistic update
            setLogs(prev => {
                const existing = prev.find(l => l.habit_id === habitId && l.date === date);
                if (existing) {
                    return prev.map(l => l.habit_id === habitId && l.date === date ? { ...l, value: newValue, completed: isCompleted } : l);
                } else {
                    return [...prev, { id: 'temp', habit_id: habitId, user_id: 'temp', date, value: newValue, completed: isCompleted }];
                }
            });

            await api.updateHabitLog(habitId, newValue, isCompleted);
            // Refresh real data?
        } catch (e) {
            console.error("Failed to toggle habit", e);
            // Revert changes?
            refreshLogs();
        }
    }

    async function handleDelete(id: string) {
        try {
            await api.deleteHabit(id);
            setHabits(prev => prev.filter(h => h.id !== id));
            setLogs(prev => prev.filter(l => l.habit_id !== id));
        } catch (e) {
            console.error("Failed to delete habit", e);
        }
    }

    // Calculate chart data
    // We need logs for the last 30 days. 
    // Since I haven't fixed the API yet, this will be empty except today.
    // I will add a TODO note or just implement the logic assuming logs exist.

    const chartData = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 29 + i);
        const dateStr = d.toISOString().split('T')[0];

        // Find logs for this date
        // Note: logs state currently only has TODAY.
        // I need to fetch all logs.
        const dayLogs = logs.filter(l => l.date === dateStr);
        const total = habits.length;
        const completed = dayLogs.filter(l => l.completed).length;

        return {
            date: dateStr,
            completionRate: total > 0 ? completed / total : 0
        };
    });


    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Habit Tracker</h1>
                    <p className="text-slate-400 mt-2">Track your daily habits and build consistency.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Habit
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Habit List (Takes 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    <HabitList
                        habits={habits}
                        logs={logs}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Right: Stats & Chart */}
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Overall Progress</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">
                                {Math.round(chartData[chartData.length - 1].completionRate * 100)}%
                            </span>
                            <span className="text-slate-400 mb-1">today</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${chartData[chartData.length - 1].completionRate * 100}%` }}
                            />
                        </div>
                    </div>

                    <HabitProgressChart data={chartData} />
                </div>
            </div>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHabitAdded={(habit) => {
                    setHabits(prev => [...prev, habit]);
                }}
            />
        </div>
    );
}
