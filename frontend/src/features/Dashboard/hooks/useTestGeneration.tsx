import { Language } from '@/types/types';

interface UseTestGenerationProps {
    apiUrl: string;
    onNewCode: (code: string) => void;
}

export const useTestGeneration = ({ apiUrl, onNewCode }: UseTestGenerationProps) => {
    const generateTests = async (code: string, language: Language) => {
        try {
            const response = await fetch(`${apiUrl}generatetests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    language: language.toLowerCase(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate tests');
            }

            const data = await response.json();
            onNewCode(data.code);
        } catch (error) {
            console.error('Error generating tests:', error);
            throw error;
        }
    };

    return { generateTests };
};