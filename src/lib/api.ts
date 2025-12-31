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

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    icon?: string;
    goal_frequency: 'daily' | 'weekly' | 'monthly';
    target_value: number;
    unit?: string;
    created_at: string;
}

export interface HabitLog {
    id: string;
    habit_id: string;
    user_id: string;
    date: string;
    value: number;
    completed: boolean;
}

export interface JournalEntry {
    id: string;
    user_id: string;
    date: string;
    mood: string;
    grateful_for: string[];
    highlights: string;
    challenges: string;
    learnings: string;
    goals_tomorrow: string;
    notes: string;
    created_at: string;
}

export const api = {
    // --- METRICS ---
    getUser: async () => {
        return await supabase.auth.getUser();
    },

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

    updateMetrics: async (metrics: Partial<DailyMetric>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const date = new Date().toISOString().split('T')[0];
        // Upsert for today
        const { data, error } = await supabase
            .from('daily_metrics')
            .upsert({ ...metrics, date, user_id: user.id }, { onConflict: 'date' })
            .select()
            .single();

        if (error) throw error;
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
        return months.map((month: any) => ({
            ...month,
            weeks: weeks.filter((week: any) => week.month_id === month.id)
        }));
    },

    updateRoadmapMonth: async (id: string, updates: Partial<RoadmapMonth>) => {
        const { error } = await supabase
            .from('roadmap_months')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
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
        return data?.map((log: { slot_id: string }) => log.slot_id) || [];
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

    // --- HABITS (ENHANCED) ---
    getHabits: async () => {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Habit[] || [];
    },

    createHabit: async (habit: Omit<Habit, 'id' | 'created_at' | 'user_id'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('habits')
            .insert([{ ...habit, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as Habit;
    },

    deleteHabit: async (id: string) => {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    getHabitLogs: async (date?: string) => {
        let query = supabase.from('habit_logs').select('*');
        if (date) {
            query = query.eq('date', date);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as HabitLog[] || [];
    },

    updateHabitLog: async (habitId: string, value: number, completed: boolean) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const date = new Date().toISOString().split('T')[0];
        // Upsert log
        const { data, error } = await supabase
            .from('habit_logs')
            .upsert(
                { habit_id: habitId, date, value, completed, user_id: user.id },
                { onConflict: 'habit_id,date' }
            )
            .select()
            .single();

        if (error) throw error;
        return data as HabitLog;
    },

    toggleHabit: async (habitId: string, isCompleted: boolean) => {
        // Legacy support or simple toggle wrapper
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const date = new Date().toISOString().split('T')[0];
        const { error } = await supabase
            .from('habit_logs')
            .upsert(
                { habit_id: habitId, date, completed: isCompleted, value: isCompleted ? 1 : 0, user_id: user.id },
                { onConflict: 'habit_id,date' }
            );
        if (error) throw error;
    },

    // --- JOURNAL ---
    getJournalEntries: async () => {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data as JournalEntry[] || [];
    },

    getJournalEntry: async (date: string) => {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('date', date)
            .maybeSingle();

        if (error) throw error;
        return data as JournalEntry | null;
    },

    saveJournalEntry: async (entry: Partial<JournalEntry> & { date: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Remove undefined fields
        const cleanEntry = Object.fromEntries(
            Object.entries(entry).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await supabase
            .from('journal_entries')
            .upsert({ ...cleanEntry, user_id: user.id }, { onConflict: 'date,user_id' } as any)
            .select()
            .single();

        if (error) throw error;
        return data as JournalEntry;
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
                .maybeSingle();

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
