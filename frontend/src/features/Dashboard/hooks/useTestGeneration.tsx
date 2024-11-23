import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/supabaseClient';

interface TestsGenerationParams {
    sessionId: string;
    apiUrl: string;
}

export function useTestsGeneration({ sessionId, apiUrl }: TestsGenerationParams) {
    const updateSession = async (code: string) => {
        const { error } = await supabase
            .from('sessions')
            .update({ code })
            .eq('id', sessionId);

        if (error) throw error;
    };

    const {
        mutate: generateTests,
        isLoading: isGeneratingTests,
        error: testsError,
        isError: isTestsError
    } = useMutation({
        mutationFn: async (code: string) => {
            const response = await fetch(`${apiUrl}generatetests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    language: 'python', // You might want to make this dynamic
                }),
            });

            if (!response.ok) throw new Error('Failed to generate tests');
            return response.json();
        },
        onSuccess: async (data) => {
            await updateSession(data.code);
        },
        onError: (error) => {
            console.error('Failed to generate tests:', error);
        }
    });

    return {
        generateTests,
        isGeneratingTests,
        testsError,
        isTestsError
    };
}