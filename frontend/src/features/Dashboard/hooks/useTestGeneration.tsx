import { useState } from 'react';

interface UseTestsGenerationProps {
    sessionId: string;
    apiUrl: string;
    onSuccess: (code: string, reason: string, status: string) => Promise<void>;
}

export const useTestsGeneration = ({ sessionId, apiUrl, onSuccess }: UseTestsGenerationProps) => {
    const [isGeneratingTests, setIsGeneratingTests] = useState(false);
    const [testsError, setTestsError] = useState<Error | null>(null);
    const isTestsError = !!testsError;

    const generateTests = async (code: string, language: string) => {
        setIsGeneratingTests(true);
        setTestsError(null);

        try {
            const response = await fetch(`${apiUrl}generatetests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    code
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate tests');
            }

            const data = await response.json();
            await onSuccess(data.code, data.reason, data.status);
        } catch (error) {
            setTestsError(error as Error);
            console.error('Error generating tests:', error);
        } finally {
            setIsGeneratingTests(false);
        }
    };

    return {
        generateTests,
        isGeneratingTests,
        testsError,
        isTestsError
    };
};