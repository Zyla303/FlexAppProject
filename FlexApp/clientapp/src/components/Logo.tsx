import logo from '../assets/logo.png';
import { FC } from 'react';


export const Logo: FC = () => {

    return (
        <img src={logo} alt='logo' className='logo'/>
    )
}