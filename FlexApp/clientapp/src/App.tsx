import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import './styles/app.scss'

export const App: FC = () => {

    const isAuthenticated = false;

    return (
        <div className='useless-app-div'>
            <Routes>
                <Route
                    path='/'
                    element={isAuthenticated ? <HomePage/> : <LoginPage/>}
                />
            </Routes>
        </div>
    )
}
