import { useState } from "react";
import { cn } from "@/lib/utils";

const ICONS = [
    "💧", "🏃", "📚", "🧘", "💪", "🍎", "💤", "🚫",
    "📝", "🎨", "🎵", "💼", "🧹", "💊", "🌞", "🌙",
    "💧", "🔥", "🌱", "🍳", "🚶", "🚴", "🏊", "🤸",
    "🧠", "💰", "🤝", "❤️", "👨‍👩‍👧‍👦", "🐶", "🐱", "🪴"
];

interface HabitIconPickerProps {
    value?: string;
    onChange: (icon: string) => void;
}

export function HabitIconPicker({ value, onChange }: HabitIconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-800 border border-slate-700 rounded-lg hover:border-purple-500 transition-colors"
                title="Select Icon"
            >
                {value || "✨"}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 z-20 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-4 grid grid-cols-6 gap-2">
                        {ICONS.map((icon, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    onChange(icon);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-slate-800 transition-colors",
                                    value === icon ? "bg-purple-500/20 ring-1 ring-purple-500" : ""
                                )}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
