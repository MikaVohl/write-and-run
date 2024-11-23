import { cn } from "@/lib/utils";

interface ImageViewerProps {
    imageUrl: string;
    zoom: number;
    className?: string;
}

export const ImageViewer = ({ imageUrl, zoom, className }: ImageViewerProps) => {
    return (
        <div className={cn(
            "w-full h-full bg-gray-50 overflow-auto",
            className
        )}>
            <div className="min-h-full w-full flex items-center justify-center p-4">
                <div className="relative transition-transform duration-200 ease-out">
                    <img
                        src={imageUrl}
                        alt="Document Image"
                        className="max-w-none object-contain rounded-lg shadow-lg"
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center',
                            maxHeight: zoom === 1 ? 'calc(100vh - 16rem)' : 'none',
                            maxWidth: zoom === 1 ? '100%' : 'none'
                        }}
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};