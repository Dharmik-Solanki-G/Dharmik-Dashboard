"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { api, DailyMetric } from "@/lib/api";

export default function ProgressPage() {
    const [data, setData] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<DailyMetric | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const metricsData = await api.getMetrics(); // Get latest
                setMetrics(metricsData);

                // Mocking history for visualization purposes until enough data is collected
                const baseRevenue = metricsData?.revenue || 0;
                const baseFollowers = metricsData?.followers_ig || 0;

                const mockHistory = [
                    { name: 'Mon', revenue: baseRevenue * 0.8, ig: baseFollowers - 50, yt: 120 },
                    { name: 'Tue', revenue: baseRevenue * 0.85, ig: baseFollowers - 40, yt: 125 },
                    { name: 'Wed', revenue: baseRevenue * 0.9, ig: baseFollowers - 30, yt: 130 },
                    { name: 'Thu', revenue: baseRevenue * 0.95, ig: baseFollowers - 20, yt: 135 },
                    { name: 'Fri', revenue: baseRevenue, ig: baseFollowers, yt: 140 }, // Today
                    { name: 'Sat', revenue: baseRevenue, ig: baseFollowers, yt: 140 },
                    { name: 'Sun', revenue: baseRevenue, ig: baseFollowers, yt: 140 },
                ];
                setData(mockHistory);

            } catch (e) {
                console.error("Failed to load progress data", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="text-slate-500 p-8">Loading Analytics...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Growth Analytics</h1>
                <p className="text-slate-400 mt-2">Tracking the journey to ₹10L/month.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Revenue Trajectory (₹)
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Follower Growth Chart */}
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Audience Growth
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                />
                                <Bar dataKey="ig" fill="#a855f7" name="Instagram" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="yt" fill="#ef4444" name="YouTube" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6">
                    <p className="text-slate-400 text-sm">Follower Growth (Weekly)</p>
                    <p className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                        +124 <TrendingUp className="w-4 h-4 text-green-400" />
                    </p>
                </div>
                <div className="glass-panel p-6">
                    <p className="text-slate-400 text-sm">Revenue Growth (MoM)</p>
                    <p className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                        0% <span className="text-xs text-slate-500 font-normal">Starting from 0</span>
                    </p>
                </div>
                <div className="glass-panel p-6">
                    <p className="text-slate-400 text-sm">Engagement Rate</p>
                    <p className="text-2xl font-bold text-white mt-1">4.2%</p>
                </div>
            </div>
        </div>
    );
}
