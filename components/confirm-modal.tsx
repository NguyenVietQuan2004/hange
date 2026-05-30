"use client";

import { AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;

  title?: string;

  description?: string;

  confirmText?: string;

  cancelText?: string;

  loading?: boolean;

  variant?: "danger" | "default";

  onConfirm: () => void;

  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-primary hover:opacity-90 text-primary-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-border p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
