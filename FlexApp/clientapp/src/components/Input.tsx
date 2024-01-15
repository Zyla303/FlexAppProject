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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref): JSX.Element => {
    const {
      label,
      icon,
      className,
      type = "text",
      onBlur,
      onChange,
      borderStyle = "full",
      ...rest
    } = props;

    return (
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
    );
  }
);

Input.displayName = "Input";
