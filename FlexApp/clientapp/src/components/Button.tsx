import { forwardRef } from 'react';
import '../styles/button.scss'

interface ButtonProps {
    label: string;
    className?: string;
    onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref): JSX.Element => {
    const { onClick, label, className = '' } = props;

    return (
        <button 
            className={`button ${className}`} 
            ref={ref}
            onClick={onClick}
        >
            {label}
            <span className={`button-mask button-slides slides-right gradient-background`}></span>
        </button>
    )
})
