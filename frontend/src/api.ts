import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Database, Tables, TablesInsert } from './types/supabase';

type UpdateSessionInput = {
    id: string;
    detected_code?: string;
    code?: string;
    language?: string;
    status?: string;
};



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


export const useSession = (id: string) => {
    return useQuery<Tables<'sessions'>>({
        queryKey: ['sessions', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!id,
    });
};
export const updateSession = async (updatedSession: UpdateSessionInput) => {

    console.log(updatedSession);
    const { data, error } = await supabase
        .from('sessions')
        .update({
            detected_code: updatedSession.detected_code,
            code: updatedSession.code,
            language: updatedSession.language as any,
            status: updatedSession.status as any,
        })
        .eq('id', updatedSession.id!)
        .select('*')
        .single();
    if (error) throw error;
    return data;
};


export const useSessionImage = (sessionId: string) => {
    return useQuery<Tables<'session_image'>>({
        queryKey: ['session_image', sessionId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('session_image')
                .select('*')
                .eq('session_id', sessionId)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!sessionId,
    });
};