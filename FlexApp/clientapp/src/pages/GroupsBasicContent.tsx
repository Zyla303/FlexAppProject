import { FC } from "react";
import { ExpandableCard } from "../components/ExpandableCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { StatusInfo } from "../components/StatusInfo";
import { Pill } from "../components/Pill";
import { useAppContext } from "../context/useAppContext";
import { useGroupQueries } from "../hooks/use-group-queries";
import { useForm } from "react-hook-form";

export const GroupsBasicContent: FC = () => {
  const {
    groups: { data = [] },
    createGroup: { mutate: createGroup, status: createGroupStatus },
    joinGroup: { mutate: joinGroup, status: joinGroupStatus },
  } = useGroupQueries();

  const { register: registerGroupName, handleSubmit: submitGroupName } =
    useForm<{ name: string }>();

  const { register: registerJoinGroup, handleSubmit: submitJoinGroup } =
    useForm<{ code: string }>();

  const { setChosenGroupId } = useAppContext();

  const handleCreateGroup = ({ name }: { name: string }) => {
    createGroup({ name });
  };

  const handleJoinGroup = ({ code }: { code: string }) => {
    joinGroup(code);
  };

  return (
    <>
      <ExpandableCard
        header="Create new group"
        className="group-content-basic-form"
        defaultState
      >
        <Input label="Group's name" {...registerGroupName("name")} />
        <div className="button-status-container">
          <Button label="Create" onClick={submitGroupName(handleCreateGroup)} />

          <StatusInfo
            status={createGroupStatus}
            message="Couldnt create new group"
          />
        </div>
      </ExpandableCard>

      <ExpandableCard
        header="Join group"
        className="group-content-basic-form"
        defaultState
      >
        <Input label="Code" {...registerJoinGroup("code")} />
        <div className="button-status-container">
          <Button label="Join" onClick={submitJoinGroup(handleJoinGroup)} />
          <StatusInfo status={joinGroupStatus} message="Joined successfully" />
        </div>
      </ExpandableCard>

      <ExpandableCard
        header="Your groups"
        className="your-groups-content"
        cardClassName="your-groups-card"
        defaultState
      >
        {data.map((group) => (
          <Pill
            key={group.id}
            title={group.name}
            onClick={() => setChosenGroupId(group.id)}
          />
        ))}
      </ExpandableCard>
    </>
  );
};
