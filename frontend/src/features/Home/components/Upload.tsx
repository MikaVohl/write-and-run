import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@radix-ui/react-progress';
import { Upload, X, CheckCircle2, Settings2 } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { Navigate, useNavigate } from 'react-router-dom';

interface FileUploadState {
    file: File | null;
    preview: string | null;
}

interface CompilerSettings {
    language: string;
    // optimization: string;
}

const processWithExternalAPI = async (session: any, signedUrl: string) => {
    // Send signed URL to external API
    const response = await fetch('YOUR_EXTERNAL_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`, // Your API key
        },
        body: JSON.stringify({
            imageUrl: signedUrl,
            language: session.language,
            sessionId: session.id
        })
    });

    if (!response.ok) {
        throw new Error('Processing failed');
    }

    return await response.json();
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/heic'];

const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const UploadComponent = () => {
    const [uploadState, setUploadState] = useState<FileUploadState>({
        file: null,
        preview: null,
    });
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const validateFile = (file: File): boolean => {
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a PNG, JPG, or HEIC image.",
                variant: "destructive",
            });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: "File too large",
                description: "Please upload an image under 10MB.",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleFile = async (file: File) => {
        if (!validateFile(file)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadState({
                file,
                preview: reader.result as string,
            });
            handleSubmit(file);  // Automatically start upload
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (file: File) => {
        setIsLoading(true);
        setUploadProgress(0);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const sessionId = crypto.randomUUID();
        const imageId = crypto.randomUUID();
        // Create file path with user folder structure
        const filePath = `${user.id}/${imageId}`;

        try {
            // Upload to storage
            setUploadProgress(25);
            const { error: uploadError } = await supabase.storage
                .from('code-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            if (uploadError) throw uploadError;

            setUploadProgress(60);

            // Create session record
            const { error: sessionError } = await supabase
                .from('sessions')
                .insert([{
                    id: sessionId,
                    user_id: user.id,
                    status: 'pending'
                }]);
            if (sessionError) throw sessionError;

            // Create image record using the same ID as the filename
            const { error: imageError } = await supabase
                .from('session_image')
                .insert([{
                    id: imageId, // Use the same ID that we used for the filename
                    name: file.name, // Store the original filename
                    type: file.type,
                    size: file.size,
                    session_id: sessionId,
                    uploaded_by: user.id
                }]);
            if (imageError) throw imageError;
            setUploadProgress(100);

            navigate(`/sessions/${sessionId}`);

        } catch (error) {
            console.error('Upload error:', error);
            if (file && user) {
                await supabase.storage
                    .from('code-images')
                    .remove([filePath])
                    .catch(e => console.error('Failed to cleanup file:', e));
            }

            toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Upload failed. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="p-6">
            <Card className="w-full p-4 mx-auto">
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span>Uploading image...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    ) : (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`
                                relative overflow-hidden
                                border-2 border-dashed rounded-lg p-12
                                ${isDragging
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-gray-300 dark:border-gray-700'
                                }
                                transition-all duration-300 ease-in-out
                                cursor-pointer group
                            `}
                        >
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.heic"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer block text-center">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                <p className="text-xl font-medium">
                                    Drop your code image here or click to upload
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    PNG, JPG, HEIC • Max 10MB
                                </p>
                            </label>
                            {isDragging && (
                                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm animate-pulse" />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
export default UploadComponent;