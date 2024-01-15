import {
  useMutation,
  useQuery,
  DefaultError,
  useQueryClient,
} from "@tanstack/react-query";
import { get, httpDelete, post } from "../http-factory";
import { UserData } from "../context/appContext";

type Group = {
  createdBy: string | null;
  createdById: string;
  id: string;
  invitationCode: string;
  name: string;
};

export const useGroupQueries = (groupId?: string) => {
  const queryClient = useQueryClient();

  const groups = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () =>
      get("/groups/GetLoggedUserGroups", {
        baseURL: "https://localhost:7117/workflow",
      }),
  });

  const groupInformation = useQuery<Group>({
    queryKey: ["groupInformation", groupId],
    queryFn: ({ queryKey: [, groupId] }) =>
      get("/groups/GetGroupInformations", {
        params: { id: groupId },
        baseURL: "https://localhost:7117/workflow",
      }),
    enabled: !!groupId,
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

  const deleteGroup = useMutation<Group, DefaultError, Pick<Group, "id">>({
    mutationFn: ({ id }) =>
      httpDelete("/groups/DeleteGroup", {
        params: { id },
        baseURL: "https://localhost:7117/workflow",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  return {
    groups,
    createGroup,
    joinGroup,
    usersInGroup,
    groupInformation,
    deleteGroup,
  };
};
