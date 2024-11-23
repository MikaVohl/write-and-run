import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Tables, TablesInsert } from './types/supabase';

type UpdateSessionPayload = Partial<Omit<Tables<'sessions'>, 'id' | 'created_at'>>;


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

export const useUpdateSession = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: UpdateSessionPayload) => {
            const { data, error } = await supabase
                .from('sessions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (updatedSession) => {
            // Update individual session cache
            queryClient.setQueryData(['sessions', id], updatedSession);

            // Update sessions list cache
            queryClient.setQueryData<Tables<'sessions'>[]>(['sessions'], (oldSessions) => {
                if (!oldSessions) return [updatedSession];
                return oldSessions.map((session) =>
                    session.id === id ? updatedSession : session
                );
            });
        },
    });
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