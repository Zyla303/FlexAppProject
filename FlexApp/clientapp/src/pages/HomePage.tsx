import { FC } from "react";
import { Logo } from "../components/Logo";
import { Navigation } from "../components/Navigation";
import { useAppContext } from "../context/useAppContext";
import { ProfileContent } from "./ProfileContent";
import { GroupsContent } from "./GroupsContent";

export const HomePage: FC = () => {
  const { chosenView } = useAppContext();

  return (
    <div className="home-page">
      <Logo noText />

      <div className="home-page-content">
        <Navigation />
        {chosenView === "profile" && <ProfileContent />}
        {chosenView === "groups" && <GroupsContent />}
      </div>
    </div>
  );
};
