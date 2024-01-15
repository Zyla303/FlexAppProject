import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { get, httpDelete, post } from "../http-factory";
import { AxiosError } from "axios";

export type Room = {
  id: string;
  groupId: string;
  number: string;
  name: string;
};

export const useRoomQueries = (groupId?: string) => {
  const queryClient = useQueryClient();

  const rooms = useQuery<Room[]>({
    queryKey: ["rooms", groupId],
    queryFn: ({ queryKey: [, groupId] }) =>
      get("/room/ListOfRooms", {
        params: { groupId },
        baseURL: "https://localhost:7117/workflow",
      }),
    enabled: !!groupId,
  });

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

  const deleteRoom = useMutation<Room, DefaultError, Pick<Room, "id">>({
    mutationFn: ({ id }) =>
      httpDelete("/room/RemoveRoom", {
        params: { roomId: id },
        baseURL: "https://localhost:7117/workflow",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return { rooms, createRoom, deleteRoom };
};
