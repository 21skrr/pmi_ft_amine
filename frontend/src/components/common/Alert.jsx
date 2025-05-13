import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  // Alert type styles
  const alertStyles = {
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-400" />,
      title: "text-blue-800",
      text: "text-blue-700",
    },
    success: {
      container: "bg-green-50 border-green-200",
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      title: "text-green-800",
      text: "text-green-700",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      title: "text-yellow-800",
      text: "text-yellow-700",
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
      title: "text-red-800",
      text: "text-red-700",
    },
  };

  const { container, icon, title: titleClass, text } = alertStyles[type];

  return (
    <div className={`rounded-md border p-4 ${container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${titleClass}`}>{title}</h3>
          )}
          <div className={`text-sm ${title ? "mt-2" : ""} ${text}`}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
