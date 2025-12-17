export const masterPlan = {
    startDate: "2025-12-17",
    endDate: "2026-12-16",
    goals: {
        revenue: "₹10,00,000/month",
        followers_ig: "1,000,000",
        followers_yt: "500,000",
        products: 8
    },
    monthlyBreakdown: [
        {
            month: 1,
            name: "Month 1: Foundation & Browser",
            focus: "Full-stack + Agentic Browser",
            revenue_target: "₹50k",
            weeks: [
                { week: 1, focus: "TypeScript & Tooling", status: "current" },
                { week: 2, focus: "Next.js App Router + Auth", status: "pending" },
                { week: 3, focus: "Multi-Agent Orchestration", status: "pending" },
                { week: 4, focus: "DevOps + First Launch", status: "pending" }
            ]
        },
        {
            month: 2,
            name: "Month 2: Finance AI",
            focus: "Trading Platform & Infra",
            revenue_target: "₹1.5L",
            weeks: [
                { week: 5, focus: "Trading Data Infrastructure", status: "pending" },
                { week: 6, focus: "Strategy Builder + Backtesting", status: "pending" },
                { week: 7, focus: "Auto Trader + Risk Agent", status: "pending" },
                { week: 8, focus: "Trading Platform Launch", status: "pending" }
            ]
        },
        // Add more months as needed based on the plan
    ],
    dailySchedule: [
        { time: "04:45", activity: "Wake Up + Hydrate", type: "health" },
        { time: "05:15", activity: "Workout (Str/Cardio)", type: "health" },
        { time: "06:30", activity: "DEEP WORK 1: Core Build", type: "build" },
        { time: "09:00", activity: "Day Job", type: "job" },
        { time: "11:30", activity: "Walk + Creativity", type: "health" },
        { time: "12:00", activity: "DEEP WORK 2: Build + Record", type: "build" },
        { time: "14:00", activity: "Social Engagement", type: "social" },
        { time: "15:00", activity: "Learning Rotation", type: "learn" },
        { time: "19:30", activity: "Planning & Review", type: "admin" },
        { time: "22:30", activity: "Sleep", type: "health" }
    ],
    quotes: [
        "Consistency > Intensity",
        "Build First, Content Second",
        "Done > Perfect",
        "Revenue > Vanity Metrics",
        "You have 14 days left in 2025 to start your comeback.",
        "The only difference: Did you start today?"
    ]
};
