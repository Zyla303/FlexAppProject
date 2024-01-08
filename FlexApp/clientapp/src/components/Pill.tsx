import { FC } from 'react';
import '../styles/pill.scss'

interface PillProps {
    content: string;
    onClick?: () => void;
    photo?: string;
}

export const Pill: FC<PillProps> = ({content, onClick, photo}) => {
    return (
        <div className={`pill ${photo ? 'with-photo' : ''}`} onClick={onClick}>
            <p title={content}>
                {content}
            </p>
            {photo && (
                <div className='img-container'>
                    <img src={photo} alt='profile picture'/>
                </div>
            )}
        </div>
    )
}