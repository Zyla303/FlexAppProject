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
import { useRoomQueries } from "../hooks/use-room-queries";
import { useForm } from "react-hook-form";

export const ParticularGroupContent: FC = () => {
  const {
    chosenGroupId = "",
    setChosenGroupId,
    setChosenRoomId,
  } = useAppContext();

  const {
    usersInGroup: { data: usersInGroup = [] },
    groupInformation: { data: groupInformation },
    deleteGroup: { mutate: deleteGroup },
  } = useGroupQueries(chosenGroupId);

  const {
    rooms: { data = [] },
    createRoom: {
      mutate: createRoom,
      status: createRoomStatus,
      error: createRoomError,
    },
  } = useRoomQueries(chosenGroupId);

  const { register: registerCreateRoom, handleSubmit: submitCreateRoom } =
    useForm<{ name: string; roomNumber: string }>();

  const handleCreateRoom = ({
    name,
    roomNumber,
  }: {
    name: string;
    roomNumber: string;
  }) => {
    createRoom({ name, roomNumber });
  };
  const handleRemoveGroup = () => {
    deleteGroup({
      id: chosenGroupId,
    });
    setChosenGroupId(undefined);
  };

  return (
    <>
      <Card className="particular-group-top-panel">
        <div className="group-title">
          <p title="Group name too long to display lorem ipsum">
            {groupInformation?.name}
          </p>
        </div>
        <div className="button-container">
          <Button label="Remove group" onClick={handleRemoveGroup} />
        </div>
      </Card>

      <ExpandableCard
        header="Add room"
        className="group-content-basic-form"
        defaultState
      >
        <Input label="Room name" {...registerCreateRoom("name")} />
        <Input label="Room number" {...registerCreateRoom("roomNumber")} />
        <div className="button-status-container">
          <Button label="Create" onClick={submitCreateRoom(handleCreateRoom)} />
          <StatusInfo
            status={createRoomStatus}
            message={createRoomError?.response?.data as string}
          />
        </div>
      </ExpandableCard>

      <ExpandableCard
        header="Group code"
        className="group-code-content"
        defaultState
      >
        <Pill title={groupInformation?.invitationCode} />
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
        {data.map((room) => (
          <Pill
            key={room.id}
            title={room.name}
            onClick={() => setChosenRoomId(room.id)}
          />
        ))}
      </ExpandableCard>
    </>
  );
};
