import { FC } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ExpandableCard } from "../components/ExpandableCard";
import { Pill } from "../components/Pill";
import { useAppContext } from "../context/useAppContext";
import { Input } from "../components/Input";
import { StatusInfo } from "../components/StatusInfo";
import profilePic from "../assets/default-profile-pic.png";
import "../styles/particular-group-room-content.scss";
import { useGroupQueries } from "../hooks/use-group-queries";

export const ParticularGroupContent: FC = () => {
  const { chosenGroupId, setChosenRoomId } = useAppContext();

  const {
    usersInGroup: { data: usersInGroup = [] },
  } = useGroupQueries(chosenGroupId);

  const rooms = [
    "Room 1",
    "Room 2",
    "Test room",
    "Room XYZ",
    "Best room ever",
    "Room with too long name lorem ipsum dolor sit amet",
  ];

  return (
    <>
      <Card className="particular-group-top-panel">
        <div className="group-title">
          <p title="Group name too long to display lorem ipsum">Group name</p>
        </div>
        <div className="button-container">
          <Button label="Remove group" />
        </div>
      </Card>

      <ExpandableCard
        header="Add room"
        className="group-content-basic-form"
        defaultState
      >
        <Input label="Room's name" />
        <div className="button-status-container">
          <Button label="Create" />
          <StatusInfo status="success" message="Created sucessfully" />
        </div>
      </ExpandableCard>

      <ExpandableCard
        header="Group code"
        className="group-code-content"
        defaultState
      >
        <Pill title="#XYZ123" />
      </ExpandableCard>

      <ExpandableCard
        header="Members"
        cardClassName="members-card"
        className="members-content"
        defaultState
      >
        {usersInGroup.map(({ firstName, lastName, id }) => (
          <Pill
            key={id}
            title={`${firstName} ${lastName}`}
            photo={profilePic}
          />
        ))}
      </ExpandableCard>

      <ExpandableCard
        header="Rooms"
        className="rooms-content"
        cardClassName="rooms-card"
        defaultState
      >
        {rooms.map((room) => (
          <Pill
            title={room}
            // TODO wrzucilem tu jedynke na sztywno, trzeba przerzucic odpowiednie ID
            onClick={() => setChosenRoomId("id")}
          />
        ))}
      </ExpandableCard>
    </>
  );
};
