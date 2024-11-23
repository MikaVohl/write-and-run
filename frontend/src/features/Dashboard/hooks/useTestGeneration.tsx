import { Language } from '@/types/types';
import { useState } from 'react';

interface UseTestGenerationProps {
    apiUrl: string;
    onNewCode: (code: string) => void;
}

export const useTestGeneration = ({ apiUrl, onNewCode }: UseTestGenerationProps) => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const generateTests = async (code: string, language: Language) => {
        setIsGenerating(true);
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
            console.log(data);
            onNewCode(data.code);
        } catch (error) {
            console.error('Error generating tests:', error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return { generateTests, isGenerating };
};