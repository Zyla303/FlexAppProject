import { FC } from "react";
import { ExpandableCard } from "../components/ExpandableCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { StatusInfo } from "../components/StatusInfo";
import { Pill } from "../components/Pill";
import { useAppContext } from "../context/useAppContext";
import { useGroupQueries } from "../hooks/use-group-queries";
import { useForm } from "react-hook-form";

const createGroupStatusMessages = {
  idle: "",
  pending: "",
  error: "Couldnt create new group",
  success: "Group created successfully",
};

const joinGroupStatusMessages = {
  idle: "",
  pending: "",
  error: "Couldnt join this group",
  success: "Joined successfully",
};

export const GroupsBasicContent: FC = () => {
  const {
    groups: { data: groups = [] },
    createGroup: { mutate: createGroup, status: createGroupStatus },
    joinGroup: { mutate: joinGroup, status: joinGroupStatus },
  } = useGroupQueries();

  const {
    register: registerGroupName,
    handleSubmit: submitGroupName,
    resetField: resetGroupName,
  } = useForm<{ name: string }>();

  const {
    register: registerJoinGroup,
    handleSubmit: submitJoinGroup,
    resetField: resetJoinGroup,
  } = useForm<{ code: string }>();

  const { setChosenGroup } = useAppContext();

  const handleCreateGroup = ({ name }: { name: string }) => {
    createGroup({ name });
    resetGroupName("name");
  };

  const handleJoinGroup = ({ code }: { code: string }) => {
    joinGroup(code);
    resetJoinGroup("code");
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
            message={createGroupStatusMessages[createGroupStatus]}
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
          <StatusInfo
            status={joinGroupStatus}
            message={joinGroupStatusMessages[joinGroupStatus]}
          />
        </div>
      </ExpandableCard>

      <ExpandableCard
        header="Your groups"
        className="your-groups-content"
        cardClassName="your-groups-card"
        defaultState
      >
        {groups.length > 0
          ? groups.map((group) => (
              <Pill
                key={group.id}
                title={group.name}
                onClick={() => setChosenGroup(group)}
              />
            ))
          : "No groups found"}
      </ExpandableCard>
    </>
  );
};
