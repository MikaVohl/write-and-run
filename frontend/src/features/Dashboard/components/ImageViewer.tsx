interface ImageViewerProps {
    imageUrl: string;
    zoom: number;

}

export const ImageViewer = ({ imageUrl, zoom}: ImageViewerProps) => (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full">
            <img
                src={imageUrl}
                alt="Code"
                className="max-w-full max-h-[calc(100vh-400px)] object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            />
        </div>
    </div>
);