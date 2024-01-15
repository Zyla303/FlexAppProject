import {
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import "../styles/status-info.scss";

interface StatusInfoProps {
  status: "error" | "success" | "pending" | "idle";
  message: string;
  secondaryMessage?: string;
}

const allowedStatuses = ["error", "success"];

export const StatusInfo: FC<StatusInfoProps> = ({
  status,
  message,
  secondaryMessage,
}) => {
  return (
    allowedStatuses.includes(status) && (
      <div className={`status-info ${status}`}>
        <FontAwesomeIcon
          icon={status === "error" ? faCircleExclamation : faCircleCheck}
        />

        {secondaryMessage ? (
          <div className="messages">
            <p>{message}</p>
            <p>{secondaryMessage}</p>
          </div>
        ) : (
          <p>{message}</p>
        )}
      </div>
    )
  );
};
