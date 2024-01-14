import { FC } from "react";
import "../styles/pill.scss";

interface PillProps {
  title: string;
  onClick?: () => void;
  photo?: string;
}

export const Pill: FC<PillProps> = ({ title, onClick, photo }) => {
  return (
    <div className={`pill ${photo ? "with-photo" : ""}`} onClick={onClick}>
      <p title={title}>{title}</p>
      {photo && (
        <div className="img-container">
          <img src={photo} alt="profile picture" />
        </div>
      )}
    </div>
  );
};
