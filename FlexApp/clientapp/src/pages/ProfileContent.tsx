import { FC } from 'react';
import { Card } from '../components/Card';
// TODO zdjecie jest na sztywno wrzucone, jak nie mamy profilowek to trzeba by zmienic tego chlopa na innego
import profilePic from '../assets/default-profile-pic.png';
import { useAppContext } from '../context/useAppContext';
import { useForm } from 'react-hook-form';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import '../styles/profiles-content.scss';

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeated: string;
}

export const ProfileContent: FC  = () => {

    const { loggedUserData, deauthenticateUser } = useAppContext();
    const { register, handleSubmit } = useForm<ChangePasswordFormValues>();

    const onSubmit = (data: ChangePasswordFormValues) => {
        // TODO handle changing password
        console.log(data);
    }

    return (
        <Card
            className='profile-content'
        >
            <div className='left-side'>
                <div className='profile-pic-container'>
                    <img src={profilePic} alt='profile-pic' className='profile-pic'/>
                </div>
                <div className='name-logout-container'>
                    <p>{loggedUserData?.username}</p>
                    <Button label='Logout' onClick={deauthenticateUser}/>
                </div>
                
            </div>
            <div className='right-side'>
                <p>Change your password</p>
                <form
                    className='login-form'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        label='Current password'
                        type='password'
                        {...register('currentPassword')}
                    />
                    <Input
                        label='New password'
                        type='password'
                        {...register('newPassword')}
                    />
                    <Input
                        label='Repeat new password'
                        type='password'
                        {...register('newPasswordRepeated')}
                    />
                    <Button label='Change password' />
                </form>
            </div>
        </Card>
    )
}