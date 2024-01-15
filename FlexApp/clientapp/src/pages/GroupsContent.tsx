import { FC } from "react";
import { useAppContext } from "../context/useAppContext";
import { GroupsBasicContent } from "./GroupsBasicContent";
import "../styles/groups-content.scss";
import { ParticularGroupContent } from "./ParticularGroupContent";
import { ParticularRoomContent } from "./ParticularRoomContent";

export const GroupsContent: FC = () => {
  const { chosenGroup, chosenRoom } = useAppContext();

  return (
    <div className="groups-content">
      {!chosenGroup?.id && !chosenRoom?.id && <GroupsBasicContent />}
      {chosenGroup?.id && !chosenRoom?.id && <ParticularGroupContent />}
      {chosenGroup?.id && chosenRoom?.id && <ParticularRoomContent />}
    </div>
  );
};
