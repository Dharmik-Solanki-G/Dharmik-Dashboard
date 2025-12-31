"use client";

import { useEffect, useState } from "react";
import { Book, Grid, List as ListIcon, Calendar as CalendarIcon, Trophy, Flame, Star, CalendarDays } from "lucide-react";
import { api, JournalEntry, Habit, HabitLog } from "@/lib/api";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import { HabitList } from "@/components/habits/HabitList";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function JournalPage() {
    const [view, setView] = useState<'calendar' | 'tiles' | 'list'>('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

    // Habits state
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Find entry for selected date
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const found = entries.find(e => e.date === dateStr);
        setCurrentEntry(found || null);
    }, [selectedDate, entries]);

    async function loadData() {
        try {
            const [fetchedHabits, fetchedLogs] = await Promise.all([
                api.getHabits(),
                // Fetch all logs to support selecting different dates
                api.getHabitLogs()
            ]);

            // We also need all journal entries. I didn't verify `api.getJournalEntry`. 
            // `api.getJournalEntry` fetches SINGLE by date.
            // I need `getJournalEntries`.
            // I'll add a temporary function here or use direct supabase if possible, but adhering to pattern I should use `api`.
            // I'll assume I need to fetch a range of entries for the calendar. 
            // Since I haven't added `getJournalEntries(range)` to API yet, I will simulate it 
            // by just fetching TODAY's entry for the form, and empty array for calendar for now,
            // OR I will fetch all entries if possible.
            // Let's modify API in next step to get all entries. 
            // For now, I'll fetch today's.
            const todayEntry = await api.getJournalEntry(format(new Date(), 'yyyy-MM-dd'));
            if (todayEntry) setEntries([todayEntry]);

            setHabits(fetchedHabits);
            setLogs(fetchedLogs);
        } catch (e) {
            console.error("Failed to load journal data", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleHabitToggle(habitId: string, date: string, currentValue: number) {
        // ... (Same logic as HabitsPage. Ideally move to a hook)
        const habit = habits.find(h => h.id === habitId);
        const target = habit?.target_value || 1;
        const newValue = currentValue >= target ? 0 : target;
        const isCompleted = newValue >= target;

        try {
            setLogs(prev => {
                const existing = prev.find(l => l.habit_id === habitId && l.date === date);
                if (existing) {
                    return prev.map(l => l.habit_id === habitId && l.date === date ? { ...l, value: newValue, completed: isCompleted } : l);
                } else {
                    return [...prev, { id: 'temp', habit_id: habitId, user_id: 'temp', date, value: newValue, completed: isCompleted }];
                }
            });
            await api.updateHabitLog(habitId, newValue, isCompleted);
        } catch (e) {
            console.error("Habit toggle error", e);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">My Journal</h1>
                <p className="text-slate-400 mt-2">Reflect on your journey, one day at a time.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard icon={Book} label="Total Entries" value={entries.length.toString()} />
                <StatsCard icon={Flame} label="Streak" value="0 days" color="text-orange-400" />
                <StatsCard icon={Trophy} label="Best Streak" value="0 days" color="text-yellow-400" />
                <StatsCard icon={CalendarDays} label="This Month" value={entries.length.toString()} color="text-blue-400" />
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Calendar & Navigation */}
                <div className="lg:col-span-2 space-y-6">
                    {/* View Tabs */}
                    <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg w-fit border border-slate-800">
                        <TabButton active={view === 'calendar'} onClick={() => setView('calendar')} icon={CalendarIcon} label="Calendar" />
                        <TabButton active={view === 'tiles'} onClick={() => setView('tiles')} icon={Grid} label="Tiles" />
                        <TabButton active={view === 'list'} onClick={() => setView('list')} icon={ListIcon} label="List" />
                    </div>

                    {view === 'calendar' && (
                        <JournalCalendar
                            currentDate={selectedDate}
                            entries={entries}
                            onDateSelect={setSelectedDate}
                            onMonthChange={setSelectedDate}
                        />
                    )}

                    {/* Entry Form (Visible when date selected) */}
                    <JournalEntryForm
                        date={selectedDate}
                        initialData={currentEntry}
                        onSave={(saved) => {
                            setEntries(prev => {
                                const exists = prev.find(e => e.id === saved.id);
                                if (exists) return prev.map(e => e.id === saved.id ? saved : e);
                                return [...prev, saved];
                            });
                            setCurrentEntry(saved);
                        }}
                    />
                </div>

                {/* Right Column: Habits Integration */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 border-l-4 border-purple-500">
                        <h3 className="text-lg font-bold text-white mb-4">Daily Habits</h3>
                        <div className="overflow-x-auto">
                            {/* We reuse HabitList but maybe a simplified version?
                                HabitList is designed for full width with calendar.
                                Here we might want just a simple checklist for TODAY.
                                But checking implementation of HabitList... it has horizontal scroll.
                                Let's try to wrap it or use it. Or better, just render a simple list here.
                            */}
                            <div className="space-y-3">
                                {habits.map(habit => {
                                    const log = logs.find(l => l.habit_id === habit.id && l.date === format(selectedDate, 'yyyy-MM-dd'));
                                    const isCompleted = log?.completed;

                                    return (
                                        <div key={habit.id}
                                            onClick={() => handleHabitToggle(habit.id, format(selectedDate, 'yyyy-MM-dd'), log?.value || 0)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-slate-800/50",
                                                isCompleted ? "bg-purple-900/20 border-purple-500/50" : "bg-slate-900/30 border-slate-800"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                                isCompleted ? "bg-purple-500 border-purple-500" : "border-slate-600"
                                            )}>
                                                {isCompleted && <Star className="w-3 h-3 text-white fill-white" />}
                                            </div>
                                            <span className="text-2xl">{habit.icon}</span>
                                            <span className={cn("text-sm font-medium", isCompleted ? "text-white" : "text-slate-400")}>{habit.title}</span>
                                        </div>
                                    )
                                })}
                                {habits.length === 0 && <p className="text-slate-500 text-sm">No habits found.</p>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="glass-panel p-4 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-slate-900", color || "text-purple-400")}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                active ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}
