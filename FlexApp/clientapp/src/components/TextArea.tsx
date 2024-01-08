import { forwardRef } from 'react';
import '../styles/input.scss';

export interface InputProps {
  label: string;
  additionalClassNames?: string;

  onChange?: any;
  onBlur?: any;
}

export const TextArea = forwardRef<HTMLTextAreaElement, InputProps>((props, ref): JSX.Element => {
  const {label, additionalClassNames, onBlur, onChange, ...rest} = props;

  return (
    <div className={`input textarea ${additionalClassNames || ''}`}>
      <textarea 
        placeholder={label} 
        ref={ref} 
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      />
    </div>   
  )
})

TextArea.displayName = 'Input';