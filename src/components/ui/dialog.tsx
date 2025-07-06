"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <DialogContext.Provider
      value={{ open: open || false, onOpenChange: onOpenChange || (() => {}) }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  asChild,
  children,
  onClick,
}) => {
  const context = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: () => void }>,
      {
        onClick: () => {
          onClick?.();
          context?.onOpenChange(true);
        },
      }
    );
  }

  return (
    <button
      onClick={() => {
        onClick?.();
        context?.onOpenChange(true);
      }}
    >
      {children}
    </button>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  const context = React.useContext(DialogContext);

  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => context.onOpenChange(false)}
      />
      <div
        className={cn(
          "relative bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4 p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
};
