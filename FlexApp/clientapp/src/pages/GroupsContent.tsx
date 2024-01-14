import { FC } from "react";
import { useAppContext } from "../context/useAppContext";
import { GroupsBasicContent } from "./GroupsBasicContent";
import "../styles/groups-content.scss";
import { ParticularGroupContent } from "./ParticularGroupContent";
import { ParticularRoomContent } from "./ParticularRoomContent";

export const GroupsContent: FC = () => {
  const { chosenGroupId, chosenRoomId } = useAppContext();

  return (
    <div className="groups-content">
      {!chosenGroupId && !chosenRoomId && <GroupsBasicContent />}
      {chosenGroupId && !chosenRoomId && <ParticularGroupContent />}
      {chosenGroupId && chosenRoomId && <ParticularRoomContent />}
    </div>
  );
};
