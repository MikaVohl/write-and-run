import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState } from "react";

interface TabViewProps {
    imageUrl: string;
    problemStatement?: string;
}

export const TabView = ({ imageUrl, problemStatement }: TabViewProps) => {
    const [zoom, setZoom] = useState(1);

    return (
        <Tabs defaultValue="document" className="flex-1 bg-white flex flex-col h-full">
            <div className="flex justify-between items-center border-b shrink-0">
                <TabsList className="rounded-none border-0 bg-transparent h-[49px]">
                    <TabsTrigger
                        value="document"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Document viewer
                    </TabsTrigger>
                    <TabsTrigger
                        value="problem"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Problem
                    </TabsTrigger>
                </TabsList>
                <div className="flex gap-1 p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(1)}>
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <TabsContent
                value="document"
                className="flex-1 m-0 overflow-auto"
            >
                {imageUrl && (
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
                )}
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