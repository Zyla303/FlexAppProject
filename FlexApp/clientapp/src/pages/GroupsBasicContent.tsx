import { FC } from 'react';
import { ExpandableCard } from '../components/ExpandableCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StatusInfo } from '../components/StatusInfo';
import { Pill } from '../components/Pill';
import { useAppContext } from '../context/useAppContext';

export const GroupsBasicContent: FC = () => {

    // TODO fetchowanie group to be done tutaj
    const groups = ['Group 1', 'Group 2', 'Test group', 'Group XYZ', 'Best group ever', 'Group with too long name lorem ipsum dolor sit amet'];
    const {setChosenGroupId} = useAppContext();

    return (
        <>
            <ExpandableCard
                header='Create new group'
                className='group-content-basic-form'
                defaultState={true}
            >
                <Input label="Group's name"/>
                <div className='button-status-container'>
                    <Button label='Create'/>
                    {/* TODO to sie ma wyswietlac na jakies 5 sekund po submicie */}
                    <StatusInfo status='error' message='Couldnt create new group'/>
                </div>
            </ExpandableCard>

            <ExpandableCard
                header='Join group'
                className='group-content-basic-form'
                defaultState={true}
            >
                <Input label='Code'/>
                <div className='button-status-container'>
                    <Button label='Join'/>
                    {/* TODO to tez*/}
                    <StatusInfo status='success' message='Joined successfully'/>
                </div>
            </ExpandableCard>

            <ExpandableCard
                header='Your groups'
                className='your-groups-content'
                cardClassName='your-groups-card'
                defaultState={true}
            >
                {groups.map(group => (
                    <Pill 
                        content={group}
                        // TODO wrzucilem tu jedynke na sztywno, trzeba przerzucic odpowiednie ID
                        onClick={() => setChosenGroupId(1)}
                    />
                ))}
            </ExpandableCard>
        </>
    )
}