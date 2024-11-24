import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ImageViewerProps {
    imageUrl: string;
    zoom: number;
    className?: string;
}


export const ImageViewer = ({ imageUrl, zoom, className }: ImageViewerProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn(
            "w-full h-full bg-gray-50",
            className
        )}>
            <div className="h-full w-full flex items-center justify-center">
                {isLoading && (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        <p className="text-sm text-gray-500">Loading document...</p>
                    </div>
                )}
                {/* TODO: Show top of document image. Currently hidden behind header */}
                <img
                    src={imageUrl}
                    alt="Document Image"
                    className={cn(
                        "max-w-full h-auto object-contain rounded-lg",
                        isLoading ? "hidden" : "block"
                    )}
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center'
                    }}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};