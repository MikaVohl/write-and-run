import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  errorMessage?: string;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  setOpen,
  errorMessage
}) => {
  return (
    <AlertDialog open={open} >
      <AlertDialogContent className="max-w-sm rounded-xl border text-black">
        <AlertDialogHeader className="space-y-2 p-4">
          <AlertDialogTitle className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-red-400" />
            Error Occurred
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-black-300">
            {errorMessage || "An unexpected error occurred. Please try again."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-4 pb-4">
          <Button 
            onClick={() => setOpen(false)}
            className="rounded-xl bg-white px-4 py-1.5 text-sm text-black hover:bg-gray-100"
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ErrorDialog;