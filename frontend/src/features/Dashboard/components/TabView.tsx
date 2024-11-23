import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    ZoomIn,
    ZoomOut,
    Maximize2,
    FileText,
    Code2,
    BarChart
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageViewer } from "./ImageViewer";
import { ZoomControls } from "./ZoomControls";
import { CodeAnalysis } from "./CodeAnalysis";
import { Language } from "@/types/types";

interface TabViewProps {
    imageUrl: string;
    code?: string;
    language?: Language;
    prompt?: string;
    className?: string;
}

export const TabView = ({ imageUrl, code, language, prompt, className }: TabViewProps) => {
    const [zoom, setZoom] = useState(1);

    return (
        <Tabs defaultValue="document" className={cn("flex flex-col h-full overflow-hidden", className)}>
            {/* Header */}
            <div className="flex-none h-14 border-b border-gray-200 flex items-center justify-between bg-white">
                <TabsList className="h-full px-0 border-0 bg-transparent">
                    <TabsTrigger
                        value="document"
                        className={cn(
                            "relative h-14 px-4",
                            "inline-flex gap-2 text-sm font-medium",
                            "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5",
                            "data-[state=active]:before:bg-indigo-600",
                            "data-[state=active]:text-indigo-600",
                            "data-[state=active]:bg-indigo-50/40"
                        )}
                    >
                        <FileText className="h-5 w-5" />
                        Document
                    </TabsTrigger>
                    <TabsTrigger
                        value="analysis"
                        className={cn(
                            "relative h-14 px-4",
                            "inline-flex gap-2 text-sm font-medium",
                            "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5",
                            "data-[state=active]:before:bg-indigo-600",
                            "data-[state=active]:text-indigo-600",
                            "data-[state=active]:bg-indigo-50/40"
                        )}
                    >
                        <BarChart className="h-5 w-5" />
                        Code Analysis
                    </TabsTrigger>
                </TabsList>
                {/* <ZoomControls zoom={zoom} setZoom={setZoom} /> */}
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden">
                <TabsContent
                    value="document"
                    className={cn(
                        "absolute inset-0",
                        "flex flex-col",
                        "m-0 p-0",
                        "data-[state=inactive]:pointer-events-none",
                        "data-[state=inactive]:hidden"
                    )}
                >
                    {prompt && (
                        <div className="flex-none bg-white border-b border-gray-200">
                            <div className="max-w-3xl mx-auto px-4 py-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-sm font-medium text-gray-500">Prompt</h2>
                                </div>
                                <p className="text-lg text-gray-800 leading-relaxed">{prompt}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex-1 overflow-auto bg-gray-50">
                        <ImageViewer
                            imageUrl={imageUrl}
                            zoom={zoom}
                            className="w-full h-full"
                        />
                    </div>
                </TabsContent>

                <TabsContent
                    value="analysis"
                    className={cn(
                        "absolute inset-0",
                        "m-0 p-0",
                        "overflow-auto",
                        "data-[state=inactive]:pointer-events-none",
                        "data-[state=inactive]:hidden"
                    )}
                >
                    <CodeAnalysis code={code} language={language} />
                </TabsContent>
            </div>
        </Tabs>
    );
};