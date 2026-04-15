"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ ...props }) => (
        <div
          key={props.id}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="relative pointer-events-auto grid gap-1 rounded-md border bg-background p-6 shadow-lg max-w-md w-full text-center">
            {props.title && <ToastTitle>{props.title}</ToastTitle>}
            {props.description && (
              <ToastDescription>{props.description}</ToastDescription>
            )}
            <button
              type="button"
              onClick={() => dismiss(props.id)}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/60 hover:text-foreground"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toaster };
