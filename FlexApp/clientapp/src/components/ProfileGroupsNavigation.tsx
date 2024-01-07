import { FC } from 'react';
import { Card } from './Card';
import { useAppContext } from '../context/useAppContext';

export const ProfileGroupsNavigation: FC = () => {
    
    const {chosenView, setChosenView} = useAppContext();

    return (
        <Card
            className='profile-groups-navigation'
        >
            <div className={`profile-groups-navigation-option ${chosenView === 'profile' ? 'choice' : ''}`}>
                <p 
                    onClick={() => chosenView !== 'profile' && setChosenView('profile')}
                >
                    Profile
                </p>
            </div>

            <div className={`profile-groups-navigation-option ${chosenView === 'groups' ? 'choice' : ''}`}>
                <p 
                    onClick={() => chosenView !== 'groups' && setChosenView('groups')}
                >
                    Groups
                </p>
            </div>

        </Card>
    )
}