import { supabase } from './supabaseClient';

// Shared User ID for valid Foreign Key constraints if tables require it.
// Using a specific UUID allows all "anon" visitors to act as this single user.
const GLOBAL_USER_ID = 'c0673df5-704f-4599-884f-478ead570689';

export interface DailyMetric {
    revenue: number;
    followers_ig: number;
    followers_yt: number;
    products_live: number;
    date: string;
}

export interface RoadmapMonth {
    id: string;
    month_number: number;
    title: string;
    focus_area: string;
    revenue_target: string;
    status: 'pending' | 'current' | 'done';
    weeks: RoadmapWeek[];
}

export interface RoadmapWeek {
    id: string;
    week_number: number;
    title: string;
    status: 'pending' | 'current' | 'done';
    month_id: string;
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

export interface Todo {
    id: string;
    title: string;
    is_priority: boolean;
    is_done: boolean;
    date: string;
    created_at: string;
}

export const api = {
    // --- AUTH MOCK ---
    getUser: async () => {
        // Always return a dummy user so components don't block
        return { data: { user: { id: GLOBAL_USER_ID, email: 'admin@dharmik.com' } } };
    },

    // --- METRICS ---
    getMetrics: async () => {
        const { data, error } = await supabase
            .from('daily_metrics')
            .select('*')
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching metrics:', error);
            return null;
        }
        return data;
    },

    updateMetrics: async (metrics: Partial<DailyMetric>) => {
        const date = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('daily_metrics')
            .upsert({ ...metrics, date, user_id: GLOBAL_USER_ID }, { onConflict: 'date' })
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
            console.error('Error fetching roadmap months:', monthsError);
            return [];
        }

        const { data: weeks, error: weeksError } = await supabase
            .from('roadmap_weeks')
            .select('*')
            .order('week_number', { ascending: true });

        if (weeksError) {
            console.error('Error fetching roadmap weeks:', weeksError);
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

        if (error) {
            // Fallback to static if table not found or empty?
            console.error('Error fetching schedule:', error);
            return [
                { id: '1', start_time: '06:00', end_time: '07:00', activity: 'Morning Routine', type: 'health', category: 'Health' },
                { id: '2', start_time: '07:00', end_time: '09:00', activity: 'Deep Work (Coding)', type: 'work', category: 'Work' },
            ];
        }
        return data && data.length > 0 ? data : [
            { id: '1', start_time: '06:00', end_time: '07:00', activity: 'Morning Routine', type: 'health', category: 'Health' },
            { id: '2', start_time: '07:00', end_time: '09:00', activity: 'Deep Work (Coding)', type: 'work', category: 'Work' },
        ];
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
            .insert([{
                title,
                is_priority: isPriority,
                date: new Date().toISOString().split('T')[0],
                user_id: GLOBAL_USER_ID
            }])
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
                .insert([{ slot_id: slotId, date, user_id: GLOBAL_USER_ID }]);
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
        const { data, error } = await supabase
            .from('habits')
            .insert([{ ...habit, user_id: GLOBAL_USER_ID }])
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
        // Fetch ALL logs or filter by date
        let query = supabase.from('habit_logs').select('*');
        if (date) {
            query = query.eq('date', date);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as HabitLog[] || [];
    },

    updateHabitLog: async (habitId: string, value: number, completed: boolean) => {
        const date = new Date().toISOString().split('T')[0];
        // Upsert log
        const { data, error } = await supabase
            .from('habit_logs')
            .upsert(
                { habit_id: habitId, date, value, completed, user_id: GLOBAL_USER_ID },
                { onConflict: 'habit_id,date' }
            )
            .select()
            .single();

        if (error) throw error;
        return data as HabitLog;
    },

    toggleHabit: async (habitId: string, isCompleted: boolean) => {
        await api.updateHabitLog(habitId, isCompleted ? 1 : 0, isCompleted);
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
        // Remove undefined fields
        const cleanEntry = Object.fromEntries(
            Object.entries(entry).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await supabase
            .from('journal_entries')
            .upsert({ ...cleanEntry, user_id: GLOBAL_USER_ID }, { onConflict: 'date,user_id' } as any)
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
            // safe fallback
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
            // Using RPC for complex calculation, assumes RPC handles user_id internally via auth.uid()
            // If we are "anon", RLS might fail if it relies on auth.uid().
            // We might need to manually update the table if RPC fails.
            // Let's try RPC first.
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
