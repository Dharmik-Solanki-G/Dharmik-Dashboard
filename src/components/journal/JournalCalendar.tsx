import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalEntry } from "@/lib/api";

interface JournalCalendarProps {
    currentDate: Date;
    entries: JournalEntry[];
    onDateSelect: (date: Date) => void;
    onMonthChange: (date: Date) => void;
}

export function JournalCalendar({ currentDate, entries, onDateSelect, onMonthChange }: JournalCalendarProps) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function nextMonth() {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    function prevMonth() {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    return (
        <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Book className="w-5 h-5 text-purple-400" />
                    Archive
                </h2>
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium min-w-[140px] text-center">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-slate-500">
                {weekDays.map(day => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map(day => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const entry = entries.find(e => e.date === dateStr);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = isSameDay(day, currentDate); // Or selection state

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[100px] border border-slate-800/50 rounded-lg p-2 transition-all cursor-pointer hover:border-purple-500/30 flex flex-col justify-between group",
                                isSameMonth(day, monthStart) ? "bg-slate-900/30" : "bg-slate-900/10 text-slate-600",
                                isSelected && "ring-1 ring-purple-500 bg-purple-500/10",
                                isToday && "bg-blue-900/20 border-blue-500/30"
                            )}
                            onClick={() => onDateSelect(day)}
                        >
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                    isToday ? "bg-blue-500 text-white" : "text-slate-400"
                                )}>
                                    {format(day, dateFormat)}
                                </span>
                                {entry?.mood && (
                                    <span className="text-lg" title={`Mood: ${entry.mood}`}>
                                        {entry.mood}
                                    </span>
                                )}
                            </div>

                            {entry && (
                                <div className="mt-2 space-y-1">
                                    {entry.highlights && (
                                        <p className="text-xs text-slate-300 line-clamp-2 leading-tight">
                                            {entry.highlights}
                                        </p>
                                    )}
                                </div>
                            )}

                            {!entry && isSameMonth(day, monthStart) && (
                                <div className="mt-auto opacity-0 group-hover:opacity-100 text-center">
                                    <span className="text-[10px] uppercase tracking-wide text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded">Write</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
