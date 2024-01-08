import { FC } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import '../styles/particular-group-room-content.scss';
import { ExpandableCard } from '../components/ExpandableCard';
import { Input } from '../components/Input';
import { StatusInfo } from '../components/StatusInfo';
import { TextArea } from '../components/TextArea';

export const ParticularRoomContent: FC = () => {

    return (
        <>
            <Card
                className='particular-room-top-panel'
            >
                 <div className='room-title'> 
                    <p title='Group name'>
                        Group name
                    </p>
                    <p title='Room name'>
                        Room name
                    </p>
                 </div> 
                <div className='button-container'>
                    <Button label="Remove group"/>
                </div>
            </Card>

            <ExpandableCard
                header="Book"
                defaultState={true}
                className='book-room-panel'
            >
                <form className='book-room-form'>
                    <div className='divided-content'>
                        <div className='left-side'>
                            <p className='details-text'>Give us details about your booking</p>
                            <Input
                                label="Reason"
                            />
                            {/* <Input
                                // XD sorki nie moglem sie powstrzymac
                                className='big-input'
                                label="Description"
                            /> */}
                            <TextArea
                                label="Description"
                            />
                        </div>

                        <div className='right-side'>
                            <p className='details-text'>Pick a proper date and time for your booking</p>
                            <Input
                                label='Datepicker placeholder'
                            />
                            <StatusInfo
                                status='error'
                                message='Unable to book!'
                                secondaryMessage='Please pick a different date'
                            />
                        </div>
                    </div>
                    <Button
                        className='book-button'
                        label='Book'
                    />
                </form>

            </ExpandableCard>
        </>
    )
}