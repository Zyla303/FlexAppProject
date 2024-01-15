import { ChangeEventHandler, FocusEventHandler, forwardRef } from "react";
import "../styles/input.scss";

export interface InputProps {
  label: string;
  additionalClassNames?: string;

  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onBlur?: FocusEventHandler<HTMLTextAreaElement> | undefined;
  errorMessage?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      additionalClassNames,
      onBlur,
      onChange,
      errorMessage = "",
      ...rest
    },
    ref
  ): JSX.Element => {
    return (
      <div className={`input textarea ${additionalClassNames || ""}`}>
        <textarea
          placeholder={label}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />
        <span className="error-message">{errorMessage}</span>
      </div>
    );
  }
);

TextArea.displayName = "Input";
