import { FC } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ExpandableCard } from '../components/ExpandableCard';
import { Pill } from '../components/Pill';
import { useAppContext } from '../context/useAppContext';
import { Input } from '../components/Input';
import { StatusInfo } from '../components/StatusInfo';
import profilePic from '../assets/default-profile-pic.png';
import '../styles/particular-group-room-content.scss';

export const ParticularGroupContent: FC = () => {

    const rooms = ['Room 1', 'Room 2', 'Test room', 'Room XYZ', 'Best room ever', 'Room with too long name lorem ipsum dolor sit amet'];
    const names = ['May Losh', 'Ma II Loush', 'Mioio Ioiosh', 'Miosh', 'The Mioioioiosh'];
    
    const {setChosenRoomId} = useAppContext();

    return (
        <>
            <Card
                className='particular-group-top-panel'
            >
                 <div className='group-title'> 
                    <p title='Group name too long to display lorem ipsum'>
                        Group name
                    </p>
                 </div> 
                <div className='button-container'>
                    <Button label="Remove group"/>
                </div>
            </Card>

            <ExpandableCard
                header="Add room"
                defaultState={true}
                className='group-content-basic-form'
            >
                <Input label="Room's name"/>
                <div className='button-status-container'>
                    <Button label='Create'/>
                    <StatusInfo status='success' message='Created sucessfully'/>
                </div>
            </ExpandableCard>

            <ExpandableCard
                header="Group code"
                defaultState={true}
                className='group-code-content'
            >
                <Pill content="#XYZ123"/>
            </ExpandableCard>

            <ExpandableCard
                header="Members"
                defaultState={true}
                cardClassName='members-card'
                className='members-content'
            >
                {names.map(name => (
                    <Pill
                        content={name}
                        photo={profilePic}
                    />
                ))}
            </ExpandableCard>
            
            <ExpandableCard
                header="Rooms"
                className='rooms-content'
                cardClassName='rooms-card'
                defaultState={true}
            >
                {rooms.map(room => (
                    <Pill 
                        content={room}
                        // TODO wrzucilem tu jedynke na sztywno, trzeba przerzucic odpowiednie ID
                        onClick={() => setChosenRoomId(1)}
                    />
                ))}
            </ExpandableCard>
        </>
    )
}