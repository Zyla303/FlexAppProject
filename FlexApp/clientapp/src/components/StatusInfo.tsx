import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import '../styles/status-info.scss';

interface StatusInfoProps {
    status: 'error' | 'success';
    message: string;
    secondaryMessage?: string;
}

export const StatusInfo: FC<StatusInfoProps> = ({status, message, secondaryMessage}) => {
    return (
        <div className={`status-info ${status}`}>
            <FontAwesomeIcon icon={status === 'error' ? faCircleExclamation : faCircleCheck}/>
            
            {secondaryMessage 
                ? (
                    <div className='messages'>
                        <p>{message}</p>
                        <p>{secondaryMessage}</p>
                    </div>
                )
                : (
                    <p>{message}</p>
                )
            }
        </div>
    )
}