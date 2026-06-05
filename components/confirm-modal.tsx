// "use client";

// import { AlertTriangle } from "lucide-react";

// type ConfirmModalProps = {
//   open: boolean;

//   title?: string;

//   description?: string;

//   confirmText?: string;

//   cancelText?: string;

//   loading?: boolean;

//   variant?: "danger" | "default";

//   onConfirm: () => void;

//   onCancel: () => void;
// };

// export default function ConfirmModal({
//   open,
//   title = "Confirm Action",
//   description = "Are you sure you want to continue?",
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   loading = false,
//   variant = "default",
//   onConfirm,
//   onCancel,
// }: ConfirmModalProps) {
//   if (!open) return null;

//   const confirmClass =
//     variant === "danger"
//       ? "bg-red-600 hover:bg-red-700 text-white"
//       : "bg-primary hover:opacity-90 text-primary-foreground";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
//       <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
//         {/* Header */}
//         <div className="flex items-start gap-4 border-b border-border p-6">
//           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
//             <AlertTriangle size={22} />
//           </div>

//           <div className="flex-1">
//             <h2 className="text-lg font-bold text-foreground">{title}</h2>

//             <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 p-6">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
//           >
//             {cancelText}
//           </button>

//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${confirmClass}`}
//           >
//             {loading ? "Processing..." : confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "success" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

const variantConfig = {
  default: {
    icon: Check,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  success: {
    icon: Check,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  danger: {
    icon: X,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
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
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  if (!isVisible) return null;

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with Icon */}
          <div className={`${config.bgColor} px-8 py-8 flex flex-col items-center text-center`}>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${config.bgColor} border-2 border-current`}
            >
              <IconComponent className={`${config.iconColor} w-8 h-8`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 flex gap-3 justify-end bg-gray-50 border-t border-gray-100">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
