import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-neutral-900 group-[.toaster]:text-white group-[.toaster]:border-neutral-800 group-[.toaster]:shadow-2xl",
          description: "group-[.toast]:text-neutral-400",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-black",
          cancelButton: "group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-300",
          error: "group-[.toaster]:!bg-red-950 group-[.toaster]:!text-red-200 group-[.toaster]:!border-red-900",
          success: "group-[.toaster]:!bg-neutral-900 group-[.toaster]:!text-emerald-400 group-[.toaster]:!border-neutral-800",
        },
      }}
    />
  )
}
