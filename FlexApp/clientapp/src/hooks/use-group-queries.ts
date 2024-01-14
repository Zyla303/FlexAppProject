import { useMutation, useQuery, DefaultError } from "@tanstack/react-query";
import { get, post } from "../http-factory";
import { UserData } from "../context/appContext";

type Group = {
  createdBy: string | null;
  createdById: string;
  id: string;
  invitationCode: string;
  name: string;
};

export const useGroupQueries = (groupId?: string) => {
  const groups = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () =>
      get("/groups/GetLoggedUserGroups", {
        baseURL: "https://localhost:7117/workflow",
      }),
  });

  const usersInGroup = useQuery<UserData[]>({
    queryKey: ["usersInGroup", groupId],
    queryFn: ({ queryKey: [, groupId] }) =>
      get("/groups/GetUsersInGroups", {
        params: { groupId },
        baseURL: "https://localhost:7117/workflow",
      }),
    enabled: !!groupId,
  });

  const createGroup = useMutation<Group, DefaultError, Pick<Group, "name">>({
    mutationFn: ({ name }) =>
      post(
        "/groups/CreateGroup",
        {
          name,
        },
        {
          baseURL: "https://localhost:7117/workflow",
        }
      ),
  });

  const joinGroup = useMutation({
    mutationFn: (code: string) =>
      post(
        "/groups/JoinGroupWithCode",
        {
          code,
        },
        {
          baseURL: "https://localhost:7117/workflow",
        }
      ),
  });

  return { groups, createGroup, joinGroup, usersInGroup };
};
