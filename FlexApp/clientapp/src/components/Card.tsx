import { FC, ReactNode } from 'react';
import '../styles/card.scss'

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: FC<CardProps> = ({children, className}) => {

    return (
        <div className={`card ${className || ''}`}>
            {children}
        </div>
    )
}