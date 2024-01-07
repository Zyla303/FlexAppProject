import logo from '../assets/logo.png';
import logoNoText from '../assets/logo-no-text.png';
import { FC } from 'react';


interface LogoProps {
    noText?: boolean;
}

export const Logo: FC<LogoProps> = ({noText}) => {

    return (
        <img src={noText ? logoNoText : logo} alt='logo' className='logo'/>
    )
}