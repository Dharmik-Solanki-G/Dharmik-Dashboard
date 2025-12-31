import { useState } from "react";
import { Save } from "lucide-react";
import { api, JournalEntry } from "@/lib/api";
import { format } from "date-fns";

interface JournalEntryFormProps {
    date: Date;
    initialData?: JournalEntry | null;
    onSave: (entry: JournalEntry) => void;
}

const MOODS = ["🤩", "🙂", "😐", "😫", "😢"];

export function JournalEntryForm({ date, initialData, onSave }: JournalEntryFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mood: initialData?.mood || "",
        grateful_for_1: initialData?.grateful_for?.[0] || "",
        grateful_for_2: initialData?.grateful_for?.[1] || "",
        grateful_for_3: initialData?.grateful_for?.[2] || "",
        highlights: initialData?.highlights || "",
        challenges: initialData?.challenges || "",
        learnings: initialData?.learnings || "",
        goals_tomorrow: initialData?.goals_tomorrow || "",
        notes: initialData?.notes || ""
    });

    // Update form when initialData changes
    // (In a real app simple usage might rely on key prop forcing remount, or useEffect)
    // We'll trust the parent to handle mounting or we add useEffect if needed.

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const entryData = {
            mood: formData.mood,
            grateful_for: [formData.grateful_for_1, formData.grateful_for_2, formData.grateful_for_3].filter(Boolean),
            highlights: formData.highlights,
            challenges: formData.challenges,
            learnings: formData.learnings,
            goals_tomorrow: formData.goals_tomorrow,
            notes: formData.notes
        };

        try {
            const dateStr = date.toISOString().split('T')[0];
            const saved = await api.saveJournalEntry({
                ...entryData,
                date: dateStr
            });
            onSave(saved);
        } catch (e) {
            console.error("Failed to save entry", e);
            alert("Failed to save journal entry.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Daily Reflection
                    </h2>
                    <p className="text-slate-400 mt-1">{format(date, 'EEEE, MMMM d, yyyy')}</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Save Entry"}
                </button>
            </div>

            {/* Mood */}
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-4 uppercase tracking-wider">How are you feeling?</label>
                <div className="flex gap-4">
                    {MOODS.map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, mood: m }))}
                            className={`text-4xl p-4 rounded-2xl border-2 transition-all hover:scale-110 ${formData.mood === m ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 grayscale hover:grayscale-0'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gratitude */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-orange-300 uppercase tracking-wider">I am Grateful For...</label>
                {[1, 2, 3].map(i => (
                    <input
                        key={i}
                        type="text"
                        value={(formData as any)[`grateful_for_${i}`]}
                        onChange={e => setFormData(p => ({ ...p, [`grateful_for_${i}`]: e.target.value }))}
                        className="w-full bg-slate-900/50 border-b border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-orange-400 transition-colors placeholder:text-slate-600"
                        placeholder={`Reason ${i} to be thankful...`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Highlights */}
                <div>
                    <label className="block text-sm font-medium text-green-300 mb-2 uppercase tracking-wider">Today's Highlights</label>
                    <textarea
                        value={formData.highlights}
                        onChange={e => setFormData(p => ({ ...p, highlights: e.target.value }))}
                        className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-green-500 resize-none"
                        placeholder="What went well today?"
                    />
                </div>

                {/* Challenges */}
                <div>
                    <label className="block text-sm font-medium text-red-300 mb-2 uppercase tracking-wider">Challenges</label>
                    <textarea
                        value={formData.challenges}
                        onChange={e => setFormData(p => ({ ...p, challenges: e.target.value }))}
                        className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 resize-none"
                        placeholder="What was difficult?"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Learnings */}
                <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">Brief Learnings</label>
                    <textarea
                        value={formData.learnings}
                        onChange={e => setFormData(p => ({ ...p, learnings: e.target.value }))}
                        className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Insights & Realizations..."
                    />
                </div>

                {/* Goals Tomorrow */}
                <div>
                    <label className="block text-sm font-medium text-pink-300 mb-2 uppercase tracking-wider">Tomorrow's Goals</label>
                    <textarea
                        value={formData.goals_tomorrow}
                        onChange={e => setFormData(p => ({ ...p, goals_tomorrow: e.target.value }))}
                        className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500 resize-none"
                        placeholder="Top 3 things to accomplish..."
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">Additional Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Free writing space..."
                />
            </div>

        </form>
    );
}
