import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, FileText, Code2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabViewProps {
    imageUrl: string;
    problemStatement?: string;
}

const ZoomControls = ({ zoom, setZoom }: { zoom: number; setZoom: (zoom: number) => void }) => (
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

const ImageViewer = ({ imageUrl, zoom }: { imageUrl: string; zoom: number }) => (
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

export const TabView = ({ imageUrl, problemStatement }: TabViewProps) => {
    const [zoom, setZoom] = useState(1);
    return (
        <Tabs defaultValue="document" className="flex-1 flex flex-col h-full">
            <div className="h-14 border-b border-gray-200 flex items-center justify-between bg-white">
                <nav className="flex h-full" aria-label="Tabs">
                    <TabsList className="h-full px-0 border-0 bg-transparent">
                        <TabsTrigger
                            value="document"
                            className={cn(
                                "relative h-14 px-4",
                                "inline-flex items-center gap-2 text-sm font-medium",
                                "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5",
                                "data-[state=active]:before:bg-indigo-600",
                                "data-[state=active]:text-indigo-600",
                                "data-[state=active]:bg-indigo-50/40",
                                "data-[state=inactive]:text-gray-500",
                                "data-[state=inactive]:hover:text-gray-700",
                                "data-[state=inactive]:hover:bg-gray-50"
                            )}
                        >
                            <FileText className="h-5 w-5" />
                            Document viewer
                        </TabsTrigger>
                        <TabsTrigger
                            value="problem"
                            className={cn(
                                "relative h-14 px-4",
                                "inline-flex items-center gap-2 text-sm font-medium",
                                "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5",
                                "data-[state=active]:before:bg-indigo-600",
                                "data-[state=active]:text-indigo-600",
                                "data-[state=active]:bg-indigo-50/40",
                                "data-[state=inactive]:text-gray-500",
                                "data-[state=inactive]:hover:text-gray-700",
                                "data-[state=inactive]:hover:bg-gray-50"
                            )}
                        >
                            <Code2 className="h-5 w-5" />
                            Problem
                        </TabsTrigger>
                    </TabsList>
                </nav>
                <ZoomControls zoom={zoom} setZoom={setZoom} />
            </div>

            <TabsContent
                value="document"
                className="flex-1 m-0 overflow-auto"
            >
                {imageUrl && <ImageViewer imageUrl={imageUrl} zoom={zoom} />}
            </TabsContent>

            <TabsContent
                value="problem"
                className="flex-1 m-0 p-4 overflow-auto"
            >
                <div className="prose dark:prose-invert max-w-none">
                    {problemStatement || "No problem statement available."}
                </div>
            </TabsContent>
        </Tabs>
    );
};