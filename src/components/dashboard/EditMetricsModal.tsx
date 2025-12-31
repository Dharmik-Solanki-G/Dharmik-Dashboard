"use client";

import { useState } from "react";
import { X, Save, DollarSign, Users, Activity } from "lucide-react";
import { DailyMetric } from "@/lib/api";

interface EditMetricsModalProps {
    metrics: DailyMetric | null;
    onSave: (metrics: Partial<DailyMetric>) => Promise<void>;
    onClose: () => void;
}

export function EditMetricsModal({ metrics, onSave, onClose }: EditMetricsModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        revenue: metrics?.revenue || 0,
        followers_ig: metrics?.followers_ig || 0,
        followers_yt: metrics?.followers_yt || 0,
        products_live: metrics?.products_live || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to save metrics");
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

                <h2 className="text-xl font-bold mb-6">Update Daily Metrics</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Revenue (₹)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="number"
                                value={formData.revenue}
                                onChange={(e) => setFormData(p => ({ ...p, revenue: Number(e.target.value) }))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">IG Followers</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="number"
                                value={formData.followers_ig}
                                onChange={(e) => setFormData(p => ({ ...p, followers_ig: Number(e.target.value) }))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Products Live</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="number"
                                value={formData.products_live}
                                onChange={(e) => setFormData(p => ({ ...p, products_live: Number(e.target.value) }))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Update Metrics"}
                    </button>
                </form>
            </div>
        </div>
    );
}
