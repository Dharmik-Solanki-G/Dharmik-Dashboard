"use client";

import { masterPlan } from "@/lib/data";
import { Activity, DollarSign, Users, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const today = new Date();
  const startDate = new Date(masterPlan.startDate);
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Placeholder metrics
  const currentRevenue = 0;
  const currentFollowers = 4599;

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
          value={`₹${currentRevenue.toLocaleString()}`}
          target={masterPlan.goals.revenue}
          icon={DollarSign}
          color="text-green-400"
        />
        <StatsCard
          title="Followers (IG)"
          value={currentFollowers.toLocaleString()}
          target={masterPlan.goals.followers_ig}
          icon={Users}
          color="text-purple-400"
        />
        <StatsCard
          title="Products Live"
          value="0"
          target={`${masterPlan.goals.products}`}
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
              "{masterPlan.quotes[dayNumber % masterPlan.quotes.length]}"
            </p>
          </div>

          {/* Current Roadmap Phase */}
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Current Mission
              </h2>
              <span className="text-xs font-mono bg-blue-900/30 text-blue-300 px-2 py-1 rounded">MONTH 1</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <div>
                  <p className="text-sm text-slate-400">Focus</p>
                  <p className="text-lg font-semibold text-white">{masterPlan.monthlyBreakdown[0].focus}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Revenue Target</p>
                  <p className="text-lg font-semibold text-green-400">{masterPlan.monthlyBreakdown[0].revenue_target}</p>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-400">Weekly Milestones</p>
                {masterPlan.monthlyBreakdown[0].weeks.map((week) => (
                  <div key={week.week} className="flex items-center gap-3 p-3 rounded hover:bg-slate-800/30 transition-colors">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border",
                      week.status === 'done' ? "bg-green-500/20 border-green-500 text-green-500" :
                        week.status === 'current' ? "bg-blue-500/20 border-blue-500 text-blue-500 animate-pulse" :
                          "border-slate-700 text-slate-700"
                    )}>
                      {week.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{week.week}</span>}
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", week.status === 'current' ? "text-white" : "text-slate-400")}>{week.focus}</p>
                    </div>
                    {week.status === 'current' && <span className="text-xs text-blue-400 font-mono">IN PROGRESS</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Checklist Preview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Daily Non-Negotiables
            </h2>
            <div className="space-y-3">
              {[
                "5+ Hours Deep Work",
                "Post 1-2 Reels",
                "Update Progress Tracker",
                "Workout / Health",
                "Plan Tomorrow"
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-slate-600 group-hover:border-purple-500 transition-colors flex items-center justify-center">
                    {/* Checkbox logic would go here */}
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <button className="w-full mt-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Open Daily Planner
            </button>
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
