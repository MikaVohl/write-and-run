import { Database } from './supabase';

export type Tables = Database['public']['Tables'];

export type Session = Tables['sessions']['Row'];
export enum Language {
    python = "python",
    java = "java",
    c = "c",
    bash = "bash"
}

export type SessionStatus = 'pending' | 'completed' | 'failed';
export interface UpdateSessionInput {
    id: string;
    detected_code?: string;
    code?: string;
    language?: Language;
    status?: SessionStatus;

}
