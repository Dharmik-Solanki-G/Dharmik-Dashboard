"use client";

import { useEffect, useState } from "react";
import { Activity, DollarSign, Users, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, DailyMetric, RoadmapMonth, RoadmapWeek } from "@/lib/api";

export default function Home() {
  const [metrics, setMetrics] = useState<DailyMetric | null>(null);
  const [currentMonth, setCurrentMonth] = useState<RoadmapMonth | null>(null);
  const [loading, setLoading] = useState(true);

  // Time calculations
  const startDate = new Date("2025-12-17"); // Fixed start date
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const quotes = [
    "Consistency > Intensity",
    "Build First, Content Second",
    "Done > Perfect",
    "Revenue > Vanity Metrics",
    "You have 14 days left in 2025 to start your comeback.",
    "The only difference: Did you start today?"
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsData, roadmapData] = await Promise.all([
          api.getMetrics(),
          api.getRoadmap()
        ]);

        if (metricsData) setMetrics(metricsData);

        // Find current month/week logic could be better, defaulting to first active
        const activeMonth = roadmapData.find((m: any) => m.status === 'current') || roadmapData[0];
        setCurrentMonth(activeMonth);

      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-slate-500">Loading Dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Day <span className="text-purple-400 font-bold text-xl">{dayNumber}</span> of 365</p>
        </div>
        <div className="glass-panel px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-green-400">System Online</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue"
          value={`₹${(metrics?.revenue || 0).toLocaleString()}`}
          target={currentMonth?.revenue_target || "₹10L"}
          icon={DollarSign}
          color="text-green-400"
        />
        <StatsCard
          title="Followers (IG)"
          value={(metrics?.followers_ig || 0).toLocaleString()}
          target="1M"
          icon={Users}
          color="text-purple-400"
        />
        <StatsCard
          title="Products Live"
          value={`${metrics?.products_live || 0}`}
          target="8"
          icon={Activity}
          color="text-blue-400"
        />
        <StatsCard
          title="Streak"
          value={`${dayNumber} Days`}
          target="365 Days"
          icon={Calendar}
          color="text-orange-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Current Focus & Quote */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Motivation */}
          <div className="glass-panel p-6 border-l-4 border-purple-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Daily Wisdom</h3>
            <p className="text-2xl font-bold italic text-white/90">
              "{quotes[dayNumber % quotes.length]}"
            </p>
          </div>

          {/* Current Roadmap Phase */}
          {currentMonth && (
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Current Mission
                </h2>
                <span className="text-xs font-mono bg-blue-900/30 text-blue-300 px-2 py-1 rounded uppercase">{currentMonth.title.split(':')[0]}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-sm text-slate-400">Focus</p>
                    <p className="text-lg font-semibold text-white">{currentMonth.focus_area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Revenue Target</p>
                    <p className="text-lg font-semibold text-green-400">{currentMonth.revenue_target}</p>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-400">Weekly Milestones</p>
                  {currentMonth.weeks?.map((week) => (
                    <div key={week.id} className="flex items-center gap-3 p-3 rounded hover:bg-slate-800/30 transition-colors">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border",
                        week.status === 'done' ? "bg-green-500/20 border-green-500 text-green-500" :
                          week.status === 'current' ? "bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse" :
                            "border-slate-700 text-slate-700"
                      )}>
                        {week.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{week.week_number}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", week.status === 'current' ? "text-white" : "text-slate-400")}>{week.title}</p>
                      </div>
                      {week.status === 'current' && <span className="text-xs text-blue-400 font-mono">IN PROGRESS</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Daily Checklist Preview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 h-full flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Grind?</h2>
            <p className="text-slate-400 mb-6">Open your daily planner to track your deep work and tasks.</p>
            <a href="/planner" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Open Daily Planner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, target, icon: Icon, color }: any) {
  return (
    <div className="glass-panel p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-16 h-16" />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("p-2 rounded-lg bg-slate-900/80", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-slate-400 text-sm font-medium">{title}</span>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          Target: {target}
          <ArrowUpRight className="w-3 h-3" />
        </p>
      </div>
    </div>
  )
}
