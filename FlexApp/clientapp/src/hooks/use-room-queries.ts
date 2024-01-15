import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "../http-factory";
import { AxiosError } from "axios";

type Room = {
  id: string;
  groupId: string;
  number: string;
  name: string;
};

export const useRoomQueries = (groupId?: string) => {
  const rooms = useQuery<Room[]>({
    queryKey: ["rooms", groupId],
    queryFn: ({ queryKey: [, groupId] }) =>
      get("/room/ListOfRooms", {
        params: { groupId },
        baseURL: "https://localhost:7117/workflow",
      }),
  });

  // const usersInGroup = useQuery<UserData[]>({
  //   queryKey: ["usersInGroup", groupId],
  //   queryFn: ({ queryKey: [, groupId] }) =>
  //     get("/groups/GetUsersInGroups", {
  //       params: { groupId },
  //       baseURL: "https://localhost:7117/workflow",
  //     }),
  //   enabled: !!groupId,
  // });

  const createRoom = useMutation<
    Room,
    AxiosError,
    { name: string; roomNumber: string }
  >({
    mutationFn: ({ name, roomNumber }) =>
      post(
        "/room/CreateRoom",
        {
          groupId,
          number: roomNumber,
          name,
        },
        {
          baseURL: "https://localhost:7117/workflow",
        }
      ),
    onSuccess: () => {
      rooms.refetch();
    },
  });

  // const joinGroup = useMutation({
  //   mutationFn: (code: string) =>
  //     post(
  //       "/groups/JoinGroupWithCode",
  //       {
  //         code,
  //       },
  //       {
  //         baseURL: "https://localhost:7117/workflow",
  //       }
  //     ),
  // });

  return { rooms, createRoom };
  // return { groups, createGroup, joinGroup, usersInGroup };
};
