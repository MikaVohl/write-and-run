import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSession } from '@/api';
import { Session, UpdateSessionInput } from '@/types/types';

export const useSessionManager = (sessionId: string) => {
    const queryClient = useQueryClient();
    const [editorCode, setEditorCode] = useState<string>("");

    const updateSessionMutation = useMutation({
        mutationFn: async (updates: Partial<Omit<UpdateSessionInput, 'id'>>) => {
            const updateData: UpdateSessionInput = {
                id: sessionId,
                ...updates
            };
            return updateSession(updateData);
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['sessions', sessionId] });
            const previousSession = queryClient.getQueryData<Session>(['sessions', sessionId]);

            queryClient.setQueryData<Session>(['sessions', sessionId], old => ({
                ...old!,
                ...newData
            }));

            return { previousSession };
        },
        onError: (err, newData, context) => {
            queryClient.setQueryData(['sessions', sessionId], context?.previousSession);
            console.error('Failed to update session:', err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
        }
    });

    return {
        editorCode,
        setEditorCode,
        // The mutation async function is passed directly
        updateSession: updateSessionMutation.mutateAsync
    };
};