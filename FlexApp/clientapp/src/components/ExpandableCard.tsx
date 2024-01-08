import { FC, useState } from 'react';
import { Card, CardProps } from './Card';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/card.scss';

interface ExpandableCardProps extends CardProps {
    header: string;
    cardClassName?: string;
    defaultState?: boolean;
}

export const ExpandableCard: FC<ExpandableCardProps> = ({header, className, cardClassName, defaultState = false, children}) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(defaultState);

    return (
        <Card
            className={cardClassName}
        >
            <div 
                className='expandable-card-header'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <p>{header}</p>
                {/*{isExpanded */}
                {/*    ? <FontAwesomeIcon icon={faChevronUp}/> */}
                {/*    : <FontAwesomeIcon icon={faChevronDown}/>*/}
                {/*}*/}
            </div>
            {isExpanded && (
                <div className={`expandable-card-content ${className}`}>
                    {children}
                </div>
            )}
        </Card>
    )
}