import { FC, useState } from 'react';
import '../styles/expandable-row.scss'

interface ExpandableRowProps {
    date: string;
    name: string;
    reason: string;
    description: string;
}

export const ExpandableRow: FC<ExpandableRowProps> = ({date, name, reason, description}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div 
            className={`expandable-row ${isExpanded ? 'full' : 'shrinked'}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <p>{date}</p>
            <p>{name}</p>
            <p>{reason}</p>
            <p>{description}</p>
        </div>
    )
}