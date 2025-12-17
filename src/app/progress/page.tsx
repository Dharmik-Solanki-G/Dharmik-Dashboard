"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Users, TrendingUp } from "lucide-react";

const revenueData = [
    { name: 'Start', value: 0 },
    { name: 'M1', value: 50000 },
    { name: 'M2', value: 150000 },
    { name: 'M3', value: 300000 },
    { name: 'M4', value: 500000 },
    { name: 'M5', value: 800000 }, // Projected
    { name: 'M6', value: 1000000 }, // Goal
];

const followerData = [
    { name: 'Dec', ig: 4599, yt: 255 },
    { name: 'Jan', ig: 15000, yt: 2000 },
    { name: 'Feb', ig: 35000, yt: 8000 },
    { name: 'Mar', ig: 50000, yt: 15000 },
    { name: 'Apr', ig: 65000, yt: 30000 },
];

export default function ProgressPage() {
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
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Follower Growth */}
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Audience Growth
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={followerData}>
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

            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Key Performance Indicators (KPIs)
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                        <p className="text-slate-400 text-sm">Consistent Days</p>
                        <p className="text-2xl font-bold text-white">0 <span className="text-sm text-slate-500 font-normal">/ 365</span></p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                        <p className="text-slate-400 text-sm">Products Shipped</p>
                        <p className="text-2xl font-bold text-white">0 <span className="text-sm text-slate-500 font-normal">/ 8</span></p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                        <p className="text-slate-400 text-sm">Deep Work Hours</p>
                        <p className="text-2xl font-bold text-white">0 <span className="text-sm text-slate-500 font-normal">/ 1800+</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
