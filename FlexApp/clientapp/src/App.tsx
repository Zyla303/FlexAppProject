import { FC } from 'react';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import './styles/app.scss'
import { useAppContext } from './context/useAppContext';

export const App: FC = () => {
    const {loggedUserData} = useAppContext();

    return (
        <div className='useless-app-div'>
            {loggedUserData ? <HomePage/> : <LoginPage/>}
        </div>
    )
}
