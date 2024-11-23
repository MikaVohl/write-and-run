import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@radix-ui/react-progress';
import { Upload, X, CheckCircle2, Settings2 } from 'lucide-react';


interface FileUploadState {
    file: File | null;
    preview: string | null;
}

interface CompilerSettings {
    language: string;
    optimization: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/heic'];

const Home = () => {
    const [uploadState, setUploadState] = useState<FileUploadState>({
        file: null,
        preview: null,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<CompilerSettings>({
        language: 'python',
        optimization: 'speed',
    });
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

        setIsLoading(true);
        setUploadProgress(0);

        const reader = new FileReader();
        reader.onloadend = async () => {
            setUploadState({
                file,
                preview: reader.result as string,
            });

            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            setIsLoading(false);
            setShowSettings(true);
        };
        reader.readAsDataURL(file);
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

    const handleSubmit = async () => {
        if (!uploadState.file) return;

        setIsLoading(true);
        try {
            // TODO: Implement your file upload logic here
            // const formData = new FormData();
            // formData.append('image', uploadState.file);
            // await uploadToServer(formData);

            toast({
                title: "Success!",
                description: "Your code image has been uploaded for analysis.",
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "There was an error uploading your image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearUpload = () => {
        setUploadState({ file: null, preview: null });
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card className="w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Write and Compile</CardTitle>
                            <CardDescription>
                                Upload a picture of your handwritten code for analysis
                            </CardDescription>
                        </div>
                        {uploadState.file && !isLoading && (
                            <CheckCircle2 className="h-8 w-8 text-green-500 animate-in fade-in duration-500" />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {!uploadState.file ? (
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
                            <label htmlFor="file-upload" className="cursor-pointer block">
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
                    ) : (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="space-y-4 p-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Uploading {uploadState.file.name}...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            ) : (
                                <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <img
                                        src={uploadState.preview!}
                                        alt="Preview"
                                        className="rounded-lg max-h-[400px] w-full object-cover mx-auto shadow-lg"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={clearUpload}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Compiler Settings Card */}
            {showSettings && (
                <Card className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Settings2 className="h-6 w-6 text-gray-500" />
                            <div>
                                <CardTitle>Compiler Settings</CardTitle>
                                <CardDescription>
                                    Configure how your code should be analyzed
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Programming Language</label>
                                <Select
                                    value={settings.language}
                                    onValueChange={(value) =>
                                        setSettings(prev => ({ ...prev, language: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="cpp">C++</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Optimization Level</label>
                                <Select
                                    value={settings.optimization}
                                    onValueChange={(value) =>
                                        setSettings(prev => ({ ...prev, optimization: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select optimization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="speed">Optimize for Speed</SelectItem>
                                        <SelectItem value="memory">Optimize for Memory</SelectItem>
                                        <SelectItem value="balanced">Balanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="relative group"
                            >
                                <span className="relative z-10">
                                    {isLoading ? "Processing..." : "Analyze Code"}
                                </span>
                                <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-md" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
};

export default Home;