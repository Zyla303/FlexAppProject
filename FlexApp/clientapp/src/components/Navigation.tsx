import { FC } from 'react';
import { ProfileGroupsNavigation } from './ProfileGroupsNavigation';
import { GoBackNavigation } from './GoBackNavigation';
import '../styles/navigation.scss';
import { useAppContext } from '../context/useAppContext';

export const Navigation: FC = () => {
    const {chosenGroupId, chosenRoomId, chosenView} = useAppContext();

    return (
        <div className='navigation'>
            <ProfileGroupsNavigation/>
            {
                chosenView ==='groups' 
                    && (chosenGroupId || chosenRoomId) 
                    && <GoBackNavigation/> 
            }
        </div>
    )
}