import { Database } from './supabase';

export type Tables = Database['public']['Tables'];

export type Session = Tables['sessions']['Row'];