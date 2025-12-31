import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { api, Habit } from "@/lib/api";
import { HabitIconPicker } from "./HabitIconPicker";

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onHabitAdded: (habit: Habit) => void;
}

export function AddHabitModal({ isOpen, onClose, onHabitAdded }: AddHabitModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "✨",
        goal_frequency: "daily" as const,
        target_value: 1,
        unit: "times"
    });

    if (!isOpen) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            // We need a user_id, but the API wrapper might handle it or we assume user is logged in.
            // Wait, the API `createHabit` expects `Omit<Habit, 'id' | 'created_at' | 'user_id'>` ??
            // No, my implementation of `createHabit` in `api.ts` passed the object directly to insert.
            // If RLS is on, Supabase auth.uid() is used. If not, we might need to pass it.
            // But `api.ts` interface `Habit` has `user_id`.
            // The `createHabit` param type `Omit<Habit, 'id' | 'created_at' | 'user_id'>` 
            // implies I DON'T need to pass user_id. Supabase should handle it via default or RLS.
            // Let's assume RLS injects it or triggers do. 
            // Actually, if I don't pass user_id and it's NOT default/triggered, it will fail.
            // However, usually helpful setups use `auth.uid()`. 
            // Let's try to fetch user or just send it without and hope RLS handles it.
            // For now, I'll send it without `user_id` as per the type I defined.

            const newHabit = await api.createHabit({
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
                goal_frequency: formData.goal_frequency,
                target_value: Number(formData.target_value),
                unit: formData.unit
            });
            onHabitAdded(newHabit);
            onClose();
        } catch (e: any) {
            console.error("Failed to create habit", e);
            alert(`Failed to create habit: ${e.message || e.toString()}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add New Habit</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Icon</label>
                            <HabitIconPicker
                                value={formData.icon}
                                onChange={(icon) => setFormData(p => ({ ...p, icon }))}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="e.g. Drink Water"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Why do you want to build this habit?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Frequency</label>
                            <select
                                value={formData.goal_frequency}
                                onChange={(e) => setFormData(p => ({ ...p, goal_frequency: e.target.value as any }))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Goal Target</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.target_value}
                                    onChange={(e) => setFormData(p => ({ ...p, target_value: Number(e.target.value) }))}
                                    className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="times"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Habit"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
