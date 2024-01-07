import { FC, ReactNode } from 'react';
import '../styles/card.scss'

export interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: FC<CardProps> = ({children, className, onClick}) => {

    return (
        <div className={`card ${className ? className : ''}`} onClick={onClick}>
            {children}
        </div>
    )
}