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

// Helper for LocalStorage
const Storage = {
    get: (key: string) => {
        if (typeof window === 'undefined') return null;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    set: (key: string, value: any) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    // SEED DATA if empty
    init: () => {
        if (typeof window === 'undefined') return;

        if (!localStorage.getItem('roadmap_data')) {
            const initialRoadmap: RoadmapMonth[] = [
                {
                    id: 'm1', month_number: 1, title: 'Month 1: Foundation', focus_area: 'TypeScript, Next.js, Multi-Agent Systems', revenue_target: '₹50K', status: 'current',
                    weeks: [
                        { id: 'w1', week_number: 1, title: 'TypeScript Foundations + LLM Tooling', status: 'current', month_id: 'm1', learn_items: [], build_items: [] },
                        { id: 'w2', week_number: 2, title: 'Next.js App Router + Auth', status: 'pending', month_id: 'm1', learn_items: [], build_items: [] },
                        { id: 'w3', week_number: 3, title: 'Supabase & Database Design', status: 'pending', month_id: 'm1', learn_items: [], build_items: [] },
                        { id: 'w4', week_number: 4, title: 'MVP Development', status: 'pending', month_id: 'm1', learn_items: [], build_items: [] }
                    ]
                }
            ];
            localStorage.setItem('roadmap_data', JSON.stringify(initialRoadmap));
        }

        if (!localStorage.getItem('daily_metrics')) {
            localStorage.setItem('daily_metrics', JSON.stringify([]));
        }
        if (!localStorage.getItem('habits')) {
            localStorage.setItem('habits', JSON.stringify([]));
        }
        if (!localStorage.getItem('habit_logs')) {
            localStorage.setItem('habit_logs', JSON.stringify([]));
        }
        if (!localStorage.getItem('journal_entries')) {
            localStorage.setItem('journal_entries', JSON.stringify([]));
        }
        if (!localStorage.getItem('schedule_logs')) {
            localStorage.setItem('schedule_logs', JSON.stringify([]));
        }
        if (!localStorage.getItem('todos')) {
            localStorage.setItem('todos', JSON.stringify([]));
        }
    }
};

// Initialize on load (client-side only check inside methods usually, but we can rely on components calling API)

export const api = {
    // --- METRICS ---
    getUser: async () => {
        // Mock user for auth checks
        return { data: { user: { id: 'local-user', email: 'user@local' } } };
    },

    getMetrics: async () => {
        Storage.init();
        const metrics = Storage.get('daily_metrics') || [];
        // Return latest by date
        return metrics.sort((a: DailyMetric, b: DailyMetric) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
    },

    updateMetrics: async (updates: Partial<DailyMetric>) => {
        Storage.init();
        const metrics = Storage.get('daily_metrics') || [];
        const date = new Date().toISOString().split('T')[0];

        const existingIndex = metrics.findIndex((m: DailyMetric) => m.date === date);
        let newData;
        if (existingIndex >= 0) {
            metrics[existingIndex] = { ...metrics[existingIndex], ...updates };
            newData = metrics[existingIndex];
        } else {
            newData = { ...updates, date, revenue: 0, followers_ig: 0, products_live: 0, followers_yt: 0 };
            metrics.push(newData);
        }

        Storage.set('daily_metrics', metrics);
        return newData;
    },

    // --- ROADMAP ---
    getRoadmap: async () => {
        Storage.init();
        const months = Storage.get('roadmap_data') || [];
        return months;
    },

    updateRoadmapMonth: async (id: string, updates: Partial<RoadmapMonth>) => {
        Storage.init();
        const months = Storage.get('roadmap_data') || [];
        const index = months.findIndex((m: RoadmapMonth) => m.id === id);
        if (index >= 0) {
            months[index] = { ...months[index], ...updates };
            Storage.set('roadmap_data', months);
        }
    },

    // --- PLANNER ---
    getSchedule: async () => {
        // Static schedule for now, or could make editable later
        return [
            { id: '1', start_time: '06:00', end_time: '07:00', activity: 'Morning Routine', type: 'health', category: 'Health' },
            { id: '2', start_time: '07:00', end_time: '09:00', activity: 'Deep Work (Coding)', type: 'work', category: 'Work' },
            { id: '3', start_time: '18:00', end_time: '19:00', activity: 'Gym', type: 'health', category: 'Health' },
        ];
    },

    getTodos: async (date: string = new Date().toISOString().split('T')[0]) => {
        Storage.init();
        const todos = Storage.get('todos') || [];
        return todos.filter((t: Todo) => t.date === date);
    },

    addTodo: async (title: string, isPriority: boolean = false) => {
        Storage.init();
        const todos = Storage.get('todos') || [];
        const newTodo = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            is_priority: isPriority,
            is_done: false,
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        };
        todos.push(newTodo);
        Storage.set('todos', todos);
        return newTodo;
    },

    toggleTodo: async (id: string, isDone: boolean) => {
        Storage.init();
        const todos = Storage.get('todos') || [];
        const index = todos.findIndex((t: Todo) => t.id === id);
        if (index >= 0) {
            todos[index].is_done = isDone;
            Storage.set('todos', todos);
        }
    },

    // --- SCHEDULE LOGS ---
    getScheduleLogs: async (date: string = new Date().toISOString().split('T')[0]) => {
        Storage.init();
        const logs = Storage.get('schedule_logs') || [];
        return logs.filter((l: any) => l.date === date).map((l: any) => l.slot_id);
    },

    toggleScheduleSlot: async (slotId: string, isCompleted: boolean) => {
        Storage.init();
        let logs = Storage.get('schedule_logs') || [];
        const date = new Date().toISOString().split('T')[0];

        if (isCompleted) {
            if (!logs.find((l: any) => l.slot_id === slotId && l.date === date)) {
                logs.push({ slot_id: slotId, date });
            }
        } else {
            logs = logs.filter((l: any) => !(l.slot_id === slotId && l.date === date));
        }
        Storage.set('schedule_logs', logs);
    },

    // --- HABITS ---
    getHabits: async () => {
        Storage.init();
        return Storage.get('habits') || [];
    },

    createHabit: async (habit: Omit<Habit, 'id' | 'created_at' | 'user_id'>) => {
        Storage.init();
        const habits = Storage.get('habits') || [];
        const newHabit = {
            ...habit,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            user_id: 'local-user'
        };
        habits.push(newHabit);
        Storage.set('habits', habits);
        return newHabit;
    },

    deleteHabit: async (id: string) => {
        Storage.init();
        let habits = Storage.get('habits') || [];
        habits = habits.filter((h: Habit) => h.id !== id);
        Storage.set('habits', habits);
    },

    getHabitLogs: async (date?: string) => {
        Storage.init();
        const logs = Storage.get('habit_logs') || [];
        if (date) {
            return logs.filter((l: HabitLog) => l.date === date);
        }
        return logs;
    },

    updateHabitLog: async (habitId: string, value: number, completed: boolean) => {
        Storage.init();
        let logs = Storage.get('habit_logs') || [];
        const date = new Date().toISOString().split('T')[0];
        const index = logs.findIndex((l: HabitLog) => l.habit_id === habitId && l.date === date);

        let log;
        if (index >= 0) {
            logs[index] = { ...logs[index], value, completed };
            log = logs[index];
        } else {
            log = {
                id: Math.random().toString(36).substr(2, 9),
                habit_id: habitId,
                date,
                value,
                completed,
                user_id: 'local-user'
            };
            logs.push(log);
        }
        Storage.set('habit_logs', logs);
        return log;
    },

    toggleHabit: async (habitId: string, isCompleted: boolean) => {
        await api.updateHabitLog(habitId, isCompleted ? 1 : 0, isCompleted);
    },

    // --- JOURNAL ---
    getJournalEntries: async () => {
        Storage.init();
        const entries = Storage.get('journal_entries') || [];
        return entries.sort((a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    getJournalEntry: async (date: string) => {
        Storage.init();
        const entries = Storage.get('journal_entries') || [];
        return entries.find((e: JournalEntry) => e.date === date) || null;
    },

    saveJournalEntry: async (entry: Partial<JournalEntry> & { date: string }) => {
        Storage.init();
        let entries = Storage.get('journal_entries') || [];
        const index = entries.findIndex((e: JournalEntry) => e.date === entry.date);

        let saved;
        if (index >= 0) {
            entries[index] = { ...entries[index], ...entry };
            saved = entries[index];
        } else {
            saved = {
                ...entry,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
                user_id: 'local-user'
            };
            entries.push(saved);
        }
        Storage.set('journal_entries', entries);
        return saved;
    },

    // --- PRODUCTIVITY ---
    getProductivityStats: async () => {
        // Calculated locally if possible, or mocked for now since strict logic was in RPC
        // Implementation of streak locally would require logic
        return { streak: 0, weekProgress: 0, todayScore: 0, todayGrade: 'N/A' };
    },

    updateDailyActivity: async (
        scheduleCompleted: number,
        scheduleTotal: number,
        tasksCompleted: number,
        tasksTotal: number,
        focusTimeSeconds: number
    ) => {
        // No-op for now in local mode or implement later
        console.log("Updated daily activity", { scheduleCompleted, scheduleTotal, tasksCompleted, tasksTotal, focusTimeSeconds });
    }
};
