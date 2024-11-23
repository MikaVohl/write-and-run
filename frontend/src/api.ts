import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Tables, TablesInsert } from './types/supabase';


export const useSessions = () => {
    return useQuery<Tables<'sessions'>[]>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });
};