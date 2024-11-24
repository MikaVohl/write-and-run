import { useToast } from "@/hooks/use-toast";
import { AlertCircleIcon } from "lucide-react";

interface ErrorToastProps {
    message: string;
}

const ErrorToast = ({ message }: ErrorToastProps) => {
    return (
        <div className="flex items-start gap-2">
            <AlertCircleIcon />
            <p className="text-sm text-gray-900">{message}</p>
        </div>
    );
};

export const useErrorToast = () => {
    const { toast } = useToast();

    const showError = (message: string) => {
        toast({
            variant: "destructive",
            duration: 5000,
            className: "bg-white border-red-100",
            description: <ErrorToast message={message} />,
        });
    };

    return { showError };
};