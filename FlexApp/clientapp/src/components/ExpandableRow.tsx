import { FC, useState } from "react";
import "../styles/expandable-row.scss";

interface ExpandableRowProps {
  dateFrom: string;
  dateTo: string;
  reason: string;
  description: string;
}

export const ExpandableRow: FC<ExpandableRowProps> = ({
  dateFrom,
  dateTo,
  reason,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      className={`expandable-row ${isExpanded ? "full" : "shrinked"}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <p>{new Date(dateFrom).toLocaleString()}</p>
      <p>{new Date(dateTo).toLocaleString()}</p>
      <p>{reason}</p>
      <p>{description}</p>
    </div>
  );
};
