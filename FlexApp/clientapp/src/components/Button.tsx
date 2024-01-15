import { CSSProperties, forwardRef } from "react";
import "../styles/button.scss";

interface ButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, label, className = "", disabled = false, style }, ref) => {
    return (
      <button
        className={`button ${className} ${disabled ? "disabled" : ""}`}
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        style={style}
      >
        {label}
        <span
          className={`button-mask button-slides slides-right gradient-background`}
        ></span>
      </button>
    );
  }
);
