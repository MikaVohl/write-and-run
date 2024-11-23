import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Session, UpdateSessionInput } from '@/types/types';
import { supabase } from '@/supabaseClient';

interface UseImageProcessingProps {
    session: Session | undefined;
    sessionImage: any;
    onCodeDetected: (code: string) => void;
    onUpdateSession: (updates: Partial<Omit<UpdateSessionInput, 'id'>>) => Promise<any>;
}

export const useImageProcessing = ({
    session,
    sessionImage,
    onCodeDetected,
    onUpdateSession
}: UseImageProcessingProps) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const apiUrl = import.meta.env.VITE_API_URL;
    const processImageMutation = useMutation({
        // TODO - Live URL

        mutationFn: async (imgUrl: string) => {
            const response = await fetch(apiUrl + 'imgtocode', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ img_url: imgUrl })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        },
        onSuccess: async (data) => {
            await onUpdateSession({
                code: data.code,
                detected_code: data.code,
                language: data.language,
                status: 'completed'
            });
            onCodeDetected(data.code);
        },
        onError: (error) => {
            console.error('Error processing image:', error);
            onUpdateSession({ status: 'failed' });
        }
    });

    useEffect(() => {
        const getSignedUrl = async () => {
            if (!sessionImage || !session?.user_id) return;

            const filePath = `${session.user_id}/${sessionImage.id}.${sessionImage.ext}`;
            const { data: urlData, error: urlError } = await supabase
                .storage
                .from('code-images')
                .createSignedUrl(filePath, 3600);

            if (urlError) {
                console.error('Error getting signed URL:', urlError);
                return;
            }

            if (urlData?.signedUrl) {
                setImageUrl(urlData.signedUrl);
            }
        };

        getSignedUrl();
    }, [sessionImage, session?.user_id]);

    useEffect(() => {
        if (imageUrl && session?.status === 'pending') {
            processImageMutation.mutate(imageUrl);
        }
    }, [imageUrl, session?.status]);

    return { imageUrl };
};