import React from "react";

const Card = ({
  children,
  title,
  titleIcon,
  headerColor,
  footerContent,
  className = "",
  headerClassName = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {title && (
        <div
          className={`p-4 ${
            headerColor || "bg-white border-b border-gray-200"
          } ${headerClassName}`}
        >
          <div className="flex items-center">
            {titleIcon && <div className="mr-2">{titleIcon}</div>}
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
        </div>
      )}

      <div className="p-4">{children}</div>

      {footerContent && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;
