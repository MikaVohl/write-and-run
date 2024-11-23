import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Language } from '@/types/types';

interface CompileResponse {
    stdout: string;
    stderr: string;
    error?: string;
    success: boolean;
}
interface CompileInput {
    code: string;
    language: Language | string;
}

export const useCompiler = () => {
    const [compilerOutput, setCompilerOutput] = useState<string>("");
    const [isCompiling, setIsCompiling] = useState<boolean>(false);
    const [isCompilerExpanded, setIsCompilerExpanded] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const compileMutation = useMutation({
        mutationFn: async ({ code, language }: CompileInput) => {
            const response = await fetch(apiUrl + 'compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json() as Promise<CompileResponse>;
        },
        onMutate: () => {
            setIsCompiling(true);
        },
        onSuccess: (data) => {
            console.log(data);
            if (data['success'] == true) {
                setCompilerOutput(data.stdout);
            } else if (data['success'] == false) {
                console.log("TEST");
                setCompilerOutput(data.error!);
            } 
 
        },
        onError: (error) => {
            console.error('Error compiling code:', error);
            setCompilerOutput("An error occurred while compiling.");
        },
        onSettled: () => {
            setIsCompiling(false);
        }
    });

    return {
        compilerOutput,
        isCompiling,
        isCompilerExpanded,
        setIsCompilerExpanded,
        setCompilerOutput,
        compile: compileMutation.mutate
    };
};