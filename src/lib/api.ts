import { supabase } from './supabaseClient';

export interface DailyMetric {
    revenue: number;
    followers_ig: number;
    followers_yt: number;
    products_live: number;
}

export interface RoadmapMonth {
    id: string;
    month_number: number;
    title: string;
    focus_area: string;
    revenue_target: string;
    weeks: RoadmapWeek[];
}

export interface RoadmapWeek {
    id: string;
    week_number: number;
    title: string;
    status: 'pending' | 'current' | 'done';
    learn_items: string[];
    build_items: string[];
}

export interface ScheduleSlot {
    id: string;
    start_time: string;
    end_time: string;
    activity: string;
    type: string;
    category: string;
}

export const api = {
    // --- METRICS ---
    getMetrics: async () => {
        const { data, error } = await supabase
            .from('daily_metrics')
            .select('*')
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle(); // Prevent error if table is empty

        if (error) {
            console.error(' Supabase error fetching metrics:', error.message, error.details);
            return null; // Return null instead of throwing or undefined
        }
        return data;
    },

    // --- ROADMAP ---
    getRoadmap: async () => {
        const { data: months, error: monthsError } = await supabase
            .from('roadmap_months')
            .select('*')
            .order('month_number', { ascending: true });

        if (monthsError) {
            console.error('Error fetching roadmap months:', monthsError.message);
            return [];
        }

        const { data: weeks, error: weeksError } = await supabase
            .from('roadmap_weeks')
            .select('*')
            .order('week_number', { ascending: true });

        if (weeksError) {
            console.error('Error fetching roadmap weeks:', weeksError.message);
            return [];
        }

        // Nest weeks into months
        return months.map(month => ({
            ...month,
            weeks: weeks.filter(week => week.month_id === month.id)
        }));
    },

    // --- PLANNER ---
    getSchedule: async () => {
        const { data, error } = await supabase
            .from('schedule_slots')
            .select('*')
            .order('start_time', { ascending: true });

        if (error) console.error('Error fetching schedule:', error);
        return data || [];
    },

    getTodos: async (date: string = new Date().toISOString().split('T')[0]) => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('date', date)
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching todos:', error);
        return data || [];
    },

    addTodo: async (title: string, isPriority: boolean = false) => {
        const { data, error } = await supabase
            .from('todos')
            .insert([{ title, is_priority: isPriority, date: new Date() }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    toggleTodo: async (id: string, isDone: boolean) => {
        const { error } = await supabase
            .from('todos')
            .update({ is_done: isDone })
            .eq('id', id);

        if (error) throw error;
    },

    // --- SCHEDULE LOGS ---
    getScheduleLogs: async (date: string = new Date().toISOString().split('T')[0]) => {
        const { data, error } = await supabase
            .from('schedule_logs')
            .select('slot_id')
            .eq('date', date);

        if (error) console.error('Error fetching schedule logs:', error);
        return data?.map(log => log.slot_id) || [];
    },

    toggleScheduleSlot: async (slotId: string, isCompleted: boolean) => {
        const date = new Date().toISOString().split('T')[0];
        if (isCompleted) {
            const { error } = await supabase
                .from('schedule_logs')
                .insert([{ slot_id: slotId, date }]);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('schedule_logs')
                .delete()
                .eq('slot_id', slotId)
                .eq('date', date);
            if (error) throw error;
        }
    },

    // --- HABITS ---
    getHabits: async () => {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    getHabitLogs: async (date: string = new Date().toISOString().split('T')[0]) => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('habit_id')
            .eq('date', date);

        if (error) throw error;
        return data?.map(log => log.habit_id) || [];
    },

    toggleHabit: async (habitId: string, isCompleted: boolean) => {
        const date = new Date().toISOString().split('T')[0];
        if (isCompleted) {
            const { error } = await supabase
                .from('habit_logs')
                .insert([{ habit_id: habitId, date }]);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('habit_logs')
                .delete()
                .eq('habit_id', habitId)
                .eq('date', date);
            if (error) throw error;
        }
    },

    // --- PRODUCTIVITY TRACKING ---
    getProductivityStats: async () => {
        try {
            // Get streak
            const { data: streakData } = await supabase.rpc('calculate_streak');

            // Get week progress
            const { data: weekData } = await supabase.rpc('calculate_week_progress');

            // Get today's stats
            const today = new Date().toISOString().split('T')[0];
            const { data: todayData } = await supabase
                .from('daily_activity_logs')
                .select('*')
                .eq('date', today)
                .single();

            return {
                streak: streakData || 0,
                weekProgress: weekData || 0,
                todayScore: todayData?.productivity_score || 0,
                todayGrade: todayData?.productivity_score
                    ? (todayData.productivity_score >= 0.90 ? 'A+' :
                        todayData.productivity_score >= 0.80 ? 'A' :
                            todayData.productivity_score >= 0.70 ? 'B+' :
                                todayData.productivity_score >= 0.60 ? 'B' :
                                    todayData.productivity_score >= 0.50 ? 'C+' : 'C')
                    : 'N/A'
            };
        } catch (error) {
            console.error('Error fetching productivity stats:', error);
            return { streak: 0, weekProgress: 0, todayScore: 0, todayGrade: 'N/A' };
        }
    },

    updateDailyActivity: async (
        scheduleCompleted: number,
        scheduleTotal: number,
        tasksCompleted: number,
        tasksTotal: number,
        focusTimeSeconds: number
    ) => {
        const today = new Date().toISOString().split('T')[0];

        try {
            await supabase.rpc('update_daily_activity', {
                p_date: today,
                p_schedule_completed: scheduleCompleted,
                p_schedule_total: scheduleTotal,
                p_tasks_completed: tasksCompleted,
                p_tasks_total: tasksTotal,
                p_focus_time_seconds: focusTimeSeconds
            });
        } catch (error) {
            console.error('Error updating daily activity:', error);
        }
    }
};
