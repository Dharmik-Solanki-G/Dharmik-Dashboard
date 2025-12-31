"use client";

import { useState } from "react";
import { X, Save, Target, Flag } from "lucide-react";
import { RoadmapMonth } from "@/lib/api";

interface EditMissionModalProps {
    month: RoadmapMonth;
    onSave: (updates: Partial<RoadmapMonth>) => Promise<void>;
    onClose: () => void;
}

export function EditMissionModal({ month, onSave, onClose }: EditMissionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        focus_area: month.focus_area || "",
        revenue_target: month.revenue_target || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to save mission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Update Current Mission</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Focus Area</label>
                        <div className="relative">
                            <Target className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={formData.focus_area}
                                onChange={(e) => setFormData(p => ({ ...p, focus_area: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-blue-500"
                                placeholder="e.g. TypeScript & Next.js"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Revenue Target</label>
                        <div className="relative">
                            <Flag className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={formData.revenue_target}
                                onChange={(e) => setFormData(p => ({ ...p, revenue_target: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-green-500"
                                placeholder="e.g. ₹50K"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Update Mission"}
                    </button>
                </form>
            </div>
        </div>
    );
}
