"use client"
import { useToast } from "@/components/ui/use-toast"
import { ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ ...props }) => (
        <div key={props.id}>
          <div className="grid gap-1">
            {props.title && <ToastTitle>{props.title}</ToastTitle>}
            {props.description && <ToastDescription>{props.description}</ToastDescription>}
          </div>
          <ToastClose />
        </div>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toaster }
