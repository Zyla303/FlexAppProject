import { forwardRef, ChangeEventHandler, FocusEventHandler } from "react";
import "../styles/input.scss";

export interface InputProps {
  label: string;
  icon?: JSX.Element;
  className?: string;
  type?: "password" | "text";
  borderStyle?: "underline" | "full";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      className,
      type = "text",
      onBlur,
      onChange,
      borderStyle = "full",
      errorMessage = "",
      ...rest
    },
    ref
  ): JSX.Element => {
    return (
      <div className="input-container">
        <div className={`input ${borderStyle} ${className || ""}`}>
          {icon}
          <input
            className={`${icon ? "icon" : "no-icon"}`}
            placeholder={label}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            {...rest}
          />
        </div>
        <span className="error-message">{errorMessage}</span>
      </div>
    );
  }
);

Input.displayName = "Input";
