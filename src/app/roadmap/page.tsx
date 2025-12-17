"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Flag, ChevronDown, ChevronUp, Calendar, BookOpen, Code, TrendingUp, Youtube, Instagram, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, RoadmapMonth } from "@/lib/api";

export default function RoadmapPage() {
    const [months, setMonths] = useState<RoadmapMonth[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

    useEffect(() => {
        async function loadRoadmap() {
            try {
                const data = await api.getRoadmap();
                setMonths(data as RoadmapMonth[]);
            } catch (e) {
                console.error("Failed to load roadmap", e);
            } finally {
                setLoading(false);
            }
        }
        loadRoadmap();
    }, []);

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center text-slate-500">Loading Roadmap...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">5-Month Master Plan</h1>
                <p className="text-slate-400 mt-2">20 weeks to ₹10L/month | 8 Products | Full-Stack Mastery</p>
            </div>

            <div className="space-y-12 relative">
                {/* Vertical Timeline */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800 hidden md:block" />

                {months.map((month) => (
                    <div key={month.id} className="relative pl-0 md:pl-20">
                        {/* Timeline Node */}
                        <div className="absolute left-[1.15rem] top-6 w-6 h-6 rounded-full border-4 border-slate-900 bg-purple-500 z-10 hidden md:block" />

                        <div className="glass-panel p-6 border-l-4 border-l-purple-500 md:border-l-slate-800 hover:border-purple-500 transition-colors">
                            {/* Month Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">{month.title}</h2>
                                    <p className="text-purple-400 font-medium">{month.focus_area}</p>
                                </div>
                                <div className="px-3 py-1 bg-slate-900 rounded border border-slate-700 text-sm">
                                    <p className="text-slate-500 text-xs uppercase">Revenue Target</p>
                                    <p className="text-green-400 font-bold">{month.revenue_target}</p>
                                </div>
                            </div>

                            {/* Weeks Grid */}
                            <div className="space-y-3">
                                {month.weeks?.map((week: any) => {
                                    const isExpanded = expandedWeek === week.id;

                                    return (
                                        <div key={week.id} className="border border-slate-800/50 rounded-lg overflow-hidden bg-slate-950/30">
                                            {/* Week Header - Clickable */}
                                            <div
                                                onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="mt-1">
                                                        {week.status === 'done' ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        ) : week.status === 'current' ? (
                                                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 animate-pulse" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-slate-700" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono text-slate-500 uppercase">Week {week.week_number}</span>
                                                            <span className="text-slate-600">•</span>
                                                            <p className={cn("text-sm font-medium", week.status === 'done' ? "text-slate-400 line-through" : "text-slate-200")}>
                                                                {week.title}
                                                            </p>
                                                        </div>
                                                        {week.week_objective && (
                                                            <p className="text-xs text-slate-500 mt-1">{week.week_objective}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="border-t border-slate-800/50 p-6 space-y-6 bg-slate-950/50">

                                                    {/* Learning Topics */}
                                                    {week.learn_topics && week.learn_topics.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-blue-400">
                                                                <BookOpen className="w-4 h-4" />
                                                                What You'll Learn
                                                            </h4>
                                                            <div className="grid md:grid-cols-2 gap-2">
                                                                {week.learn_topics.map((topic: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2 text-sm">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                                        <span className="text-slate-300">{topic}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Build Deliverables */}
                                                    {week.build_deliverables && week.build_deliverables.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-purple-400">
                                                                <Code className="w-4 h-4" />
                                                                What You'll Build
                                                            </h4>
                                                            <div className="grid md:grid-cols-2 gap-2">
                                                                {week.build_deliverables.map((item: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2 text-sm">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                                                                        <span className="text-slate-300">{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tech Stack */}
                                                    {week.tech_stack && week.tech_stack.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-green-400">
                                                                <TrendingUp className="w-4 h-4" />
                                                                Tech Stack
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {week.tech_stack.map((tech: string, i: number) => (
                                                                    <span key={i} className="px-2 py-1 bg-green-900/20 border border-green-900/30 rounded text-xs text-green-400">
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Daily Tasks */}
                                                    {week.daily_tasks && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-orange-400">
                                                                <Calendar className="w-4 h-4" />
                                                                Daily Breakdown
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {Object.entries(week.daily_tasks).map(([day, data]: [string, any]) => (
                                                                    <div key={day} className="bg-slate-900/50 rounded-lg p-3 border border-slate-800/50">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-sm font-medium text-slate-300">{day}</span>
                                                                            {data.content && (
                                                                                <div className="flex items-center gap-3 text-xs">
                                                                                    {data.content.reels > 0 && (
                                                                                        <span className="flex items-center gap-1 text-pink-400">
                                                                                            <Instagram className="w-3 h-3" />
                                                                                            {data.content.reels} reels
                                                                                        </span>
                                                                                    )}
                                                                                    {data.content.youtube > 0 && (
                                                                                        <span className="flex items-center gap-1 text-red-400">
                                                                                            <Youtube className="w-3 h-3" />
                                                                                            {data.content.youtube} video
                                                                                        </span>
                                                                                    )}
                                                                                    {data.content.posts > 0 && (
                                                                                        <span className="flex items-center gap-1 text-blue-400">
                                                                                            <FileText className="w-3 h-3" />
                                                                                            {data.content.posts} posts
                                                                                        </span>
                                                                                    )}
                                                                                    {data.content.stories > 0 && (
                                                                                        <span className="text-slate-500">{data.content.stories} stories</span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {data.tasks?.map((task: string, i: number) => (
                                                                                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                                                                    <span className="text-slate-600">•</span>
                                                                                    <span>{task}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Weekly Content Summary */}
                                                    {week.content_metrics && (
                                                        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
                                                            <h4 className="text-sm font-semibold mb-3 text-purple-300">Weekly Content Goals</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                                <div>
                                                                    <p className="text-2xl font-bold text-pink-400">{week.content_metrics.weekly_reels || 0}</p>
                                                                    <p className="text-xs text-slate-400">Reels</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-bold text-red-400">{week.content_metrics.youtube_videos || 0}</p>
                                                                    <p className="text-xs text-slate-400">YouTube</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-bold text-blue-400">{week.content_metrics.weekly_posts || 0}</p>
                                                                    <p className="text-xs text-slate-400">Posts</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-bold text-slate-400">{week.content_metrics.weekly_stories || 0}</p>
                                                                    <p className="text-xs text-slate-400">Stories</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Success Criteria */}
                                                    {week.success_criteria && (
                                                        <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4">
                                                            <h4 className="text-sm font-semibold mb-2 text-green-400">Success Criteria</h4>
                                                            <p className="text-xs text-slate-300">{week.success_criteria}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final Goal */}
                <div className="relative pl-0 md:pl-20">
                    <div className="absolute left-[1.15rem] top-6 w-6 h-6 rounded-full border-4 border-slate-900 bg-green-500 z-10 hidden md:block" />
                    <div className="glass-panel p-6 border border-green-900/50 bg-green-900/10">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-green-400">
                            <Flag className="w-5 h-5" />
                            Goal: Dec 16, 2026
                        </h2>
                        <p className="text-slate-300 mt-2">
                            Closing the year with <span className="text-white font-bold">8 Products Live</span> and <span className="text-green-400 font-bold">₹10 Lakh/Month</span> revenue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
