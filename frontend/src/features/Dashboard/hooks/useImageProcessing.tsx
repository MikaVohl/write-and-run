import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Language, Session, UpdateSessionInput } from '@/types/types';
import { supabase } from '@/supabaseClient';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UseImageProcessingProps {
    session: Session | undefined;
    sessionImage: any;
}
interface ProcessResponse {
    code: string;
    language: Language;
    concept?: string;
    summary: string;
    analysis?: string;
}

interface ImageProcessingInput {
    img_url: string;
    prompt: string;
}

export const useImageProcessing = ({
    session,
    sessionImage,
}: UseImageProcessingProps) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const apiUrl = import.meta.env.VITE_API_URL;
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const showError = (title: string, message: string) => {
        toast({
            variant: "destructive",
            duration: 5000,
            className: "bg-white border-red-100",
            description: (
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-gray-700">{title}</p>
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                </div>
            ),
        });
    };

    const processImageMutation = useMutation({
        mutationFn: async (input: ImageProcessingInput) => {
            // Call to ML API for code detection
            const response = await fetch(apiUrl + 'imgtocode', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ img_url: input.img_url, prompt: input.prompt })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json() as Promise<ProcessResponse>;
        },
        onSuccess: async (data) => {
            try {
                const detectedLanguage = data.language.toLowerCase() as Language;

                // Update session in Supabase
                const { error } = await supabase
                    .from('sessions')
                    .update({
                        code: data.code,
                        detected_code: data.code,
                        summary: data.summary,
                        language: detectedLanguage,
                        concept: data.concept,
                        status: 'completed',
                        analysis: data.analysis
                    })
                    .eq('id', session!.id);

                if (error) throw error;

                // Invalidate React Query cache to refresh UI
                queryClient.invalidateQueries({ queryKey: ['sessions', session?.id] });
            } catch (error) {
                console.error('Error updating session in Supabase:', error);
                throw error;
            }
        },
        onError: async (error) => {
            console.error('Error processing image:', error);

            // Update failure status in Supabase
            const { error: updateError } = await supabase
                .from('sessions')
                .update({ status: 'failed' })
                .eq('id', session!.id);

            showError(
                "Failed to save results",
                "There was an error saving the processed code. Please try again."
            );

            if (updateError) {
                console.error('Error updating failure status:', updateError);
            }

            queryClient.invalidateQueries({ queryKey: ['sessions', session?.id] });
        }
    });

    useEffect(() => {
        const getSignedUrl = async () => {
            if (!sessionImage || !session?.user_id) return;

            try {
                const filePath = `${session.user_id}/${sessionImage.id}.${sessionImage.ext}`;
                const { data: urlData, error: urlError } = await supabase
                    .storage
                    .from('code-images')
                    .createSignedUrl(filePath, 3600);

                if (urlError) throw urlError;

                if (urlData?.signedUrl) {
                    setImageUrl(urlData.signedUrl);
                }
            } catch (error) {
                console.error('Error getting signed URL:', error);
            }
        };

        getSignedUrl();
    }, [sessionImage, session?.user_id]);

    useEffect(() => {
        if (imageUrl && session?.status === 'pending') {
            processImageMutation.mutate({ img_url: imageUrl, prompt: session.prompt! });
        }
    }, [imageUrl, session?.status]);

    const isProcessing = processImageMutation.isLoading;
    const error = processImageMutation.error;

    return {
        imageUrl,
        isProcessing,
        error
    };
};