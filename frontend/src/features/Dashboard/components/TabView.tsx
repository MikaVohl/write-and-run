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
    problemStatement?: string;
    code?: string;
    language?: Language;
    prompt?: string;
    analysis?: string;
}
export const TabView = ({ imageUrl, problemStatement, code, language, prompt, analysis }: TabViewProps) => {
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
                            Document
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
                        <TabsTrigger
                            value="analysis"
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
                            <BarChart className="h-5 w-5" />
                            Code Analysis
                        </TabsTrigger>
                    </TabsList>
                </nav>
                <ZoomControls zoom={zoom} setZoom={setZoom} />
            </div>

            <TabsContent
  value="document"
  className="flex-1 m-0 overflow-auto flex flex-col items-center justify-center text-center p-2"
>
  <div className="text-lg font-semibold text-gray-800 p-1">
    {prompt || "No prompt available."}
  </div>
  {imageUrl && (
    <div className="max-w-full h-auto mt-4 max-w-full overflow-hidden">
      <ImageViewer
        imageUrl={imageUrl}
        zoom={zoom}

      />
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

            <TabsContent
                value="analysis"
                className="flex-1 m-0 overflow-auto"
            >
                <CodeAnalysis code={code} language={language} analysis={analysis}/>
            </TabsContent>
        </Tabs>
    );
};