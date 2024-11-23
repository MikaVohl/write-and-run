import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@radix-ui/react-progress';
import { CheckCircle2, Upload } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Prompt from './Prompt';
import { cn } from '@/lib/utils';


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/heic'];

const UploadComponent = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [showSubmitAnimation, setShowSubmitAnimation] = useState(false);


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

    const handleSubmit = async (file: File, prompt: string) => {
        setIsLoading(true);
        setUploadProgress(0);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const sessionId = crypto.randomUUID();
        const imageId = crypto.randomUUID();
        // Create file path with user folder structure
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${imageId}${fileExt ? `.${fileExt}` : ''}`;

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
                    status: 'pending',
                    prompt: prompt,
                }]);
            if (sessionError) throw sessionError;

            // Create image record using the same ID as the filename
            const { error: imageError } = await supabase
                .from('session_image')
                .insert([{
                    id: imageId, // Use the same ID that we used for the filename
                    name: file.name, // Store the original filename
                    type: file.type,
                    ext: fileExt || '',
                    size: file.size,
                    session_id: sessionId,
                    uploaded_by: user.id
                }]);
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
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
    const triggerFileInput = () => {
        document.getElementById('file-upload')?.click();
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

    const handleFile = async (file: File) => {
        if (!validateFile(file)) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFile(file);
    };

    const handlePromptSubmit = (content: string) => {
        if (!file) return;
        setShowSubmitAnimation(true);
        setTimeout(() => {
            handleSubmit(file, content);
        }, 1500); // Duration of submission animation
    };

    return (
        <div className="p-8 space-y-8">
            {isLoading ? (
                <div className="max-w-2xl mx-auto">
                    <div className="rounded-xl p-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Uploading image...</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">This might take a moment</p>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="relative">
                                <Progress
                                    value={uploadProgress}
                                    className="h-2 bg-blue-100 dark:bg-blue-900/50"
                                />
                                <div className="absolute top-3 w-full flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>Uploading</span>
                                    <span>Processing</span>
                                    <span>Completing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : imagePreview ? (
                <div className="space-y-8 transition-all duration-300">
                    <div className="dark:bg-neutral-900 rounded-xl overflow-hidden">
                        <div className="relative w-full max-h-[60vh] overflow-auto">
                            <div className="min-h-[300px] flex items-center justify-center p-6">
                                <img
                                    src={imagePreview}
                                    alt="Uploaded preview"
                                    className="max-w-full h-auto object-contain rounded-lg"
                                    style={{
                                        maxHeight: 'calc(60vh - 3rem)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative p-6">
                        {showSubmitAnimation && (
                            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-neutral-900/80 flex items-center justify-center">
                                <div className="animate-in zoom-in duration-300">
                                    <div className="flex flex-col items-center gap-4">
                                        <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                            Processing your code...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Prompt onSubmit={handlePromptSubmit} />
                    </div>
                </div>
            ) : (
                <div
                    onClick={triggerFileInput}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                    relative overflow-hidden
                    border-2 border-dashed rounded-lg p-12 py-40
                    ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-950/20'
                        }
                    transition-all duration-300 ease-in-out
                    cursor-pointer
                `}
                >
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.heic"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                    />
                    <div className="text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        <p className="text-xl font-medium">
                            Drop your code image here or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG, HEIC • Max 10MB
                        </p>
                    </div>
                    {isDragging && (
                        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm animate-pulse" />
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadComponent;