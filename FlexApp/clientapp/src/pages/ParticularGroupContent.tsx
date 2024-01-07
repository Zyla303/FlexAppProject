import { FC } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import '../styles/particular-group-content.scss';
import { ExpandableCard } from '../components/ExpandableCard';
import { Pill } from '../components/Pill';
import { useAppContext } from '../context/useAppContext';

export const ParticularGroupContent: FC = () => {

    const rooms = ['Room 1', 'Room 2', 'Test room', 'Room XYZ', 'Best room ever', 'Room with too long name lorem ipsum dolor sit amet'];
    const {setChosenRoomId} = useAppContext();

    return (
        <>
            <Card
                className='particular-group-top-panel'
            >
                {/* <div className='group-title'> */}
                    <p title='Group name too long to display lorem ipsum'>
                        Group name too long to display lorem ipsum
                    </p>
                {/* </div> */}
                <div className='button-container'>
                    <Button label="Generate code"/>
                    <Button label="Remove group"/>
                    <Button label="Add room"/>
                </div>
            </Card>

            <ExpandableCard
                header="Members"
                defaultState={true}
            >
                1
            </ExpandableCard>
            
            <ExpandableCard
                header="Rooms"
                className='rooms-content'
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