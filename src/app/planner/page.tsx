"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, Plus, CheckSquare, StopCircle, PlayCircle, TrendingUp, Flame, Target, Zap, Award, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, ScheduleSlot } from "@/lib/api";

export default function PlannerPage() {
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
    const [completedSchedule, setCompletedSchedule] = useState<string[]>([]);
    const [todos, setTodos] = useState<any[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [loading, setLoading] = useState(true);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [totalFocusTime, setTotalFocusTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Real Productivity Stats
    const [streak, setStreak] = useState(0);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [productivityGrade, setProductivityGrade] = useState('N/A');

    useEffect(() => {
        loadData();
        return () => stopTimer();
    }, []);

    // Auto-update activity log every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            updateActivityLog();
        }, 30000);
        return () => clearInterval(interval);
    }, [completedSchedule, todos, totalFocusTime, timerSeconds]);

    async function loadData() {
        try {
            const [scheduleData, todosData, logsData, statsData] = await Promise.all([
                api.getSchedule(),
                api.getTodos(),
                api.getScheduleLogs(),
                api.getProductivityStats()
            ]);
            setSchedule(scheduleData);
            setTodos(todosData);
            setCompletedSchedule(logsData);

            // Set real stats
            setStreak(statsData.streak);
            setWeeklyProgress(statsData.weekProgress);
            setProductivityGrade(statsData.todayGrade);
        } catch (e) {
            console.error("Failed to load planner data", e);
        } finally {
            setLoading(false);
        }
    }

    async function updateActivityLog() {
        const completedTodos = todos.filter(t => t.is_done).length;
        const totalTodos = todos.length;
        const currentFocusTime = totalFocusTime + timerSeconds;

        await api.updateDailyActivity(
            completedSchedule.length,
            schedule.length,
            completedTodos,
            totalTodos,
            currentFocusTime
        );

        // Refresh stats
        const stats = await api.getProductivityStats();
        setStreak(stats.streak);
        setWeeklyProgress(stats.weekProgress);
        setProductivityGrade(stats.todayGrade);
    }

    // --- TODOS ---
    async function handleAddTodo() {
        if (!newTodo.trim()) return;
        try {
            const todo = await api.addTodo(newTodo);
            setTodos([...todos, todo]);
            setNewTodo("");
            updateActivityLog();
        } catch (e) {
            console.error("Failed to add todo", e);
        }
    }

    async function handleToggleTodo(id: string, currentStatus: boolean) {
        try {
            await api.toggleTodo(id, !currentStatus);
            setTodos(todos.map(t => t.id === id ? { ...t, is_done: !currentStatus } : t));
            updateActivityLog();
        } catch (e) {
            console.error("Failed to toggle todo", e);
        }
    }

    // --- SCHEDULE ---
    async function handleToggleSchedule(id: string) {
        const isCompleted = completedSchedule.includes(id);
        try {
            await api.toggleScheduleSlot(id, !isCompleted);
            if (isCompleted) {
                setCompletedSchedule(prev => prev.filter(s => s !== id));
            } else {
                setCompletedSchedule(prev => [...prev, id]);
            }
            updateActivityLog();
        } catch (e) {
            console.error("Failed to toggle schedule", e);
        }
    }

    // --- TIMER ---
    function toggleTimer() {
        if (timerActive) {
            stopTimer();
            setTotalFocusTime(prev => prev + timerSeconds);
            updateActivityLog();
        } else {
            setTimerActive(true);
            timerRef.current = setInterval(() => {
                setTimerSeconds(s => s + 1);
            }, 1000);
        }
    }

    function stopTimer() {
        setTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerSeconds(0);
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate stats
    const completedTodos = todos.filter(t => t.is_done).length;
    const totalTodos = todos.length;
    const scheduleProgress = schedule.length > 0 ? Math.round((completedSchedule.length / schedule.length) * 100) : 0;
    const totalFocusHours = Math.floor((totalFocusTime + timerSeconds) / 3600);
    const totalFocusMins = Math.floor(((totalFocusTime + timerSeconds) % 3600) / 60);

    if (loading) return <div className="text-slate-500 p-8">Loading Planner...</div>;

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Daily Planner</h1>
                    <p className="text-slate-400 mt-1">Founders don't find time, they make it.</p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                    <div className="glass-panel px-4 py-2 border-orange-500/30">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <div>
                                <p className="text-xs text-slate-500">Streak</p>
                                <p className="text-lg font-bold text-orange-400">{streak} days</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel px-4 py-2 border-blue-500/30">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            <div>
                                <p className="text-xs text-slate-500">Week Progress</p>
                                <p className="text-lg font-bold text-blue-400">{weeklyProgress}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Schedule</p>
                            <p className="text-2xl font-bold text-white">{scheduleProgress}%</p>
                            <p className="text-xs text-slate-400 mt-1">{completedSchedule.length}/{schedule.length} completed</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="mt-3 bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-green-500 h-full transition-all" style={{ width: `${scheduleProgress}%` }} />
                    </div>
                </div>

                <div className="glass-panel p-4 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Tasks</p>
                            <p className="text-2xl font-bold text-white">{completedTodos}/{totalTodos}</p>
                            <p className="text-xs text-slate-400 mt-1">{totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}% done</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-3 bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all" style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }} />
                    </div>
                </div>

                <div className="glass-panel p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Focus Time</p>
                            <p className="text-2xl font-bold text-white">{totalFocusHours}h {totalFocusMins}m</p>
                            <p className="text-xs text-slate-400 mt-1">Today's deep work</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-4 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Productivity</p>
                            <p className="text-2xl font-bold text-white">{productivityGrade}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {productivityGrade === 'A+' || productivityGrade === 'A' ? 'Excellent' :
                                    productivityGrade === 'B+' || productivityGrade === 'B' ? 'Good' :
                                        productivityGrade === 'C+' || productivityGrade === 'C' ? 'Average' : 'Keep going'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Schedule Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Time Boxing (Interactive)
                        </h2>
                        <span className="text-xs text-slate-500">{completedSchedule.length} of {schedule.length} done</span>
                    </div>

                    <div className="space-y-2">
                        {schedule.map((slot) => {
                            const isDone = completedSchedule.includes(slot.id);
                            return (
                                <div key={slot.id}
                                    onClick={() => handleToggleSchedule(slot.id)}
                                    className={cn(
                                        "p-4 rounded-lg border flex flex-col md:flex-row md:items-center gap-4 transition-all cursor-pointer hover:border-blue-500/50 group",
                                        isDone ? "opacity-50 bg-slate-900/10 border-slate-800" :
                                            slot.type === 'work' ? "bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30" :
                                                slot.type === 'job' ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70" :
                                                    slot.type === 'health' ? "bg-green-900/10 border-green-900/30 hover:bg-green-900/20" :
                                                        "bg-slate-900/30 border-slate-800 hover:bg-slate-900/50"
                                    )}>
                                    <div className="flex items-center gap-4 w-full">
                                        <div className={cn(
                                            "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                                            isDone ? "bg-blue-500 border-blue-500 scale-110" : "border-slate-600 group-hover:border-blue-400"
                                        )}>
                                            {isDone && <CheckSquare className="w-3 h-3 text-white" />}
                                        </div>

                                        <div className="w-32 font-mono text-sm text-slate-400 shrink-0">
                                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn("font-medium transition-colors", isDone ? "text-slate-500 line-through" : "text-white group-hover:text-blue-300")}>
                                                {slot.activity}
                                            </p>
                                            <span className="text-xs uppercase tracking-wider text-slate-500">{slot.category}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks / Focus Column */}
                <div className="space-y-6">
                    {/* Focus Timer */}
                    <div className="glass-panel p-6 border-blue-500/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors" />
                        <h2 className="text-lg font-semibold mb-4 relative z-10 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-400" />
                            Deep Work Timer
                        </h2>
                        <div className="text-center py-6 border-2 border-dashed border-slate-700 rounded-lg relative z-10 bg-slate-950/50">
                            <p className="text-5xl font-bold font-mono text-white mb-2 tracking-tight">{formatTime(timerSeconds)}</p>
                            <p className="text-slate-400 text-sm mb-6">
                                {timerActive ? "Focus Mode Active ⚡" : "Ready to crush it?"}
                            </p>
                            <button
                                onClick={toggleTimer}
                                className={cn(
                                    "px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto transition-all transform hover:scale-105",
                                    timerActive
                                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-2 ring-red-500/50 animate-pulse"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20"
                                )}>
                                {timerActive ? <><StopCircle className="w-5 h-5" /> Stop</> : <><PlayCircle className="w-5 h-5" /> Start Focus</>}
                            </button>
                        </div>
                        {totalFocusTime > 0 && (
                            <div className="mt-4 text-center relative z-10">
                                <p className="text-xs text-slate-500">Total Today: <span className="text-blue-400 font-semibold">{totalFocusHours}h {totalFocusMins}m</span></p>
                            </div>
                        )}
                    </div>

                    {/* Priorities */}
                    <div className="glass-panel p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-green-400" />
                            Priorities
                            <span className="ml-auto text-xs text-slate-500">{completedTodos}/{totalTodos}</span>
                        </h2>

                        {/* Add Task Input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                placeholder="Add a new task..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                            <button
                                onClick={handleAddTodo}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-2 rounded transition-all transform hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {todos.map(todo => (
                                <div key={todo.id}
                                    onClick={() => handleToggleTodo(todo.id, todo.is_done)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded border cursor-pointer transition-all group",
                                        todo.is_done
                                            ? "bg-slate-900/30 border-slate-800 opacity-60"
                                            : "bg-slate-900/50 border-slate-700 hover:border-purple-500 hover:bg-slate-900/80"
                                    )}>
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                                        todo.is_done ? "bg-green-500 border-green-500 scale-110" : "border-slate-600 group-hover:border-purple-400"
                                    )}>
                                        {todo.is_done && <CheckSquare className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={cn("text-sm flex-1", todo.is_done ? "text-slate-500 line-through" : "text-white group-hover:text-purple-300")}>
                                        {todo.title}
                                    </span>
                                </div>
                            ))}
                            {todos.length === 0 && !loading && (
                                <div className="text-center py-8 text-slate-500">
                                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No tasks yet.</p>
                                    <p className="text-xs mt-1">Add your first priority above.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
