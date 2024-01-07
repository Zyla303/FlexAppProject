import { FC } from 'react';
import { useAppContext } from "../context/useAppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { Card } from './Card';

export const GoBackNavigation: FC = () => {

    const {chosenGroupId, setChosenGroupId, chosenRoomId, setChosenRoomId} = useAppContext();


    const goBack = () => {
        if (!chosenGroupId && !chosenRoomId)
            return;
        if (chosenGroupId && !chosenRoomId)
            setChosenGroupId(null);
        if (chosenGroupId && chosenRoomId)
            setChosenRoomId(null);
    }

    return (
        <Card
            className='go-back-navigation'
            onClick={() => goBack()}
        >
            <FontAwesomeIcon icon={faAnglesLeft}/>
            <p>
                Go back
            </p>
        </Card>
    )
}