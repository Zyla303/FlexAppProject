import { FC } from "react";
import { ProfileGroupsNavigation } from "./ProfileGroupsNavigation";
import { GoBackNavigation } from "./GoBackNavigation";
import "../styles/navigation.scss";
import { useAppContext } from "../context/useAppContext";

export const Navigation: FC = () => {
  const { chosenGroup, chosenRoom, chosenView } = useAppContext();

  return (
    <div className="navigation">
      <ProfileGroupsNavigation />
      {chosenView === "groups" && (chosenGroup?.id || chosenRoom?.id) && (
        <GoBackNavigation />
      )}
    </div>
  );
};
