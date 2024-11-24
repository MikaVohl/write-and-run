import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@radix-ui/react-progress";
import { CheckCircle2, Upload, X } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Prompt from "./Prompt";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg"];

const UploadComponent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubmitAnimation, setShowSubmitAnimation] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG or JPG image.",
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
    setIsProcessing(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const sessionId = crypto.randomUUID();
    const imageId = crypto.randomUUID();
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${imageId}${fileExt ? `.${fileExt}` : ""}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("code-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { error: sessionError } = await supabase.from("sessions").insert([
        {
          id: sessionId,
          user_id: user.id,
          status: "pending",
          prompt: prompt,
        },
      ]);
      if (sessionError) throw sessionError;

      const { error: imageError } = await supabase
        .from("session_image")
        .insert([
          {
            id: imageId,
            name: file.name,
            type: file.type,
            ext: fileExt || "",
            size: file.size,
            session_id: sessionId,
            uploaded_by: user.id,
          },
        ]);
      if (imageError) throw imageError;

      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      navigate(`/sessions/${sessionId}`);
    } catch (error) {
      console.error("Upload error:", error);
      if (file && user) {
        await supabase.storage
          .from("code-images")
          .remove([filePath])
          .catch((e) => console.error("Failed to cleanup file:", e));
      }

      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowSubmitAnimation(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
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
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8">
      {isProcessing || showSubmitAnimation ? (
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-6 animate-fade-up">
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce-slow" />
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">
                  Processing your code...
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This might take a moment
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : imagePreview ? (
        <div className="space-y-8 transition-all duration-300">
          <div className="dark:bg-neutral-900 rounded-xl overflow-hidden">
            <div className="relative w-full max-h-[60vh] overflow-auto">
              <div className="relative min-h-[300px] flex items-center justify-center p-6">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="max-w-full h-auto object-contain rounded-lg"
                  style={{
                    maxHeight: "calc(60vh - 3rem)",
                  }}
                />
                <button
                  onClick={() => {
                    setImagePreview("");
                    setFile(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  aria-label="Delete image"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative p-6">
            <Prompt onSubmit={handlePromptSubmit} />
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
                    maxHeight: "calc(60vh - 3rem)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="relative p-6">
            {showSubmitAnimation && (
              <div className="absolute inset-0 z-10 bg-white/80 dark:bg-neutral-900/80 animate-overlay-show flex items-center justify-center">
                <div className="animate-zoom-in">
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce-slow" />
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
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-950/20"
            }
                    transition-all duration-300 ease-in-out
                    cursor-pointer
                `}
        >
          <input
            type="file"
            accept=".png,.jpg,.jpeg,."
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <div className="text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            <p className="text-xl font-medium">
              Drop your code image here or click to upload
            </p>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG • Max 10MB</p>
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
