import { FC } from 'react';
import '../styles/pill.scss'

interface PillProps {
    content: string;
    onClick?: () => void;
}

export const Pill: FC<PillProps> = ({content, onClick}) => {
    return (
        <div className='pill' onClick={onClick}>
            <p title={content}>
                {content}
            </p>
        </div>
    )
}