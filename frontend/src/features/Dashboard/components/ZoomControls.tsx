import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ZoomControlsProps {
    zoom: number;
    setZoom: (zoom: number) => void;
}

export const ZoomControls = ({ zoom, setZoom }: ZoomControlsProps) => (
    <div className="flex items-center gap-2 px-4">
        {[
            { icon: ZoomOut, action: () => setZoom(Math.max(0.1, zoom - 0.1)) },
            { icon: ZoomIn, action: () => setZoom(Math.min(2, zoom + 0.1)) },
            { icon: Maximize2, action: () => setZoom(1) }
        ].map(({ icon: Icon, action }, index) => (
            <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={action}
                className="h-9 w-9 text-gray-400 hover:text-gray-500"
            >
                <Icon className="h-4 w-4" />
            </Button>
        ))}
    </div>
);