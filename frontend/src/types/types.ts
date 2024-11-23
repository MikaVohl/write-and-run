import { Database } from './supabase';

export type Tables = Database['public']['Tables'];

export type Session = Tables['sessions']['Row'];
export enum Language {
    Python = "Python",
    Java = "Java",
    C = "C",
    Bash = "Bash"
}

export type SessionStatus = 'pending' | 'completed' | 'failed';
export interface UpdateSessionInput {
    id: string;
    detected_code?: string;
    code?: string;
    language?: Language;
    status?: SessionStatus;
}
