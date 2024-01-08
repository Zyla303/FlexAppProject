import { FC } from 'react';
/*import { useForm } from 'react-hook-form';*/
import { Logo } from '../components/Logo';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

interface LoginFormValues {
    username: string;
    password: string;
}

export const LoginPage: FC = () => {

    /*const { register, handleSubmit } = useForm<LoginFormValues>();*/
    const {authenticateUser} = useAppContext();

    const onSubmit = (data: LoginFormValues) => {
        authenticateUser({username: data.username});
    }

    return (
        <div className='login-page'>
            <Logo/>
            <Card className='login-card'>
                <h2>Login</h2>
                {/*<form*/}
                {/*    className='login-form'*/}
                {/*    onSubmit={handleSubmit(onSubmit)}*/}
                {/*>*/}
                {/*    <Input*/}
                {/*        label='Username'*/}
                {/*        icon={<FontAwesomeIcon icon={faUser}/>}*/}
                {/*        {...register('username')}*/}
                {/*    />*/}
                {/*    <Input*/}
                {/*        label='Password'*/}
                {/*        type='password'*/}
                {/*        icon={<FontAwesomeIcon icon={faKey}/>}*/}
                {/*        {...register('password')}*/}
                {/*    />*/}
                {/*    <Button label='Login' />*/}
                {/*</form>*/}
            </Card>
        </div>
    )
}