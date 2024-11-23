import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoadingState = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Main content */}
            <div className="grid grid-cols-2 divide-x divide-neutral-800 bg-neutral-100 h-[calc(100%-400px)]">
                {/* Left side */}
                <div className="flex flex-col h-full">
                    {/* Tabs and content */}
                    <div className="flex-1 min-h-0">
                        <div className="flex justify-between items-center border-b border-neutral-800 px-2">
                            <Tabs>
                                <TabsList className="rounded-none border-0 bg-transparent h-10">
                                    <TabsTrigger
                                        value="document"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                        disabled
                                    >
                                        Document viewer
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="problem"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                        disabled
                                    >
                                        Problem
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="flex gap-1 p-1">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                        <div className="p-4">
                            <Skeleton className="w-full h-[calc(100vh-500px)] rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Right side - Code Editor */}
                <div className="h-full">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
                            <Skeleton className="h-4 w-[100px]" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                        <div className="flex-1 p-4">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Compiler Output */}
            <div className="h-[300px] border-t border-neutral-800 bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                </div>
                <div className="p-4">
                    <Skeleton className="w-full h-[230px]" />
                </div>
            </div>
        </div>
    );
};