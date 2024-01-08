//import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import '../styles/status-info.scss';

interface StatusInfoProps {
    status: 'error' | 'success';
    message: string;
}

export const StatusInfo: FC<StatusInfoProps> = ({status, message}) => {
    return (
        <div className={`status-info ${status}`}>
            {/*<FontAwesomeIcon icon={status === 'error' ? faCircleExclamation : faCircleCheck}/>*/}
            <p>{message}</p>
        </div>
    )
}