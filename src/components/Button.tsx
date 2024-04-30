import React from "react";

interface ButtonProps {
  label: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  className,
  disabled,
  onClick,
}) => {
  const disabledStyles = disabled
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-green-600 text-white hover:bg-green-700";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        disabled ? "opacity-50" : ""
      } ${className} ${disabledStyles}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
