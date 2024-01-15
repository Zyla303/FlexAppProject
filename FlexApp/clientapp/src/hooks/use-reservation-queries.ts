import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "../http-factory";
import { AxiosError } from "axios";

type Reservation = {
  id: string;
  roomId: string;
  createdById: string;
  reason: string;
  description: string;
  dateFrom: string;
  dateTo: string;
};

export const useReservationQueries = (roomId?: string) => {
  const reservations = useQuery<Reservation[]>({
    queryKey: ["reservations", roomId],
    queryFn: ({ queryKey: [, roomId] }) =>
      get("/Reservations/ListOfReservations", {
        params: { roomId },
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

  const createReservation = useMutation<
    Reservation,
    AxiosError,
    Omit<Reservation, "id" | "createdById">
  >({
    mutationFn: ({ roomId, dateFrom, dateTo, reason, description }) =>
      post(
        "/Reservations/CreateReservation",
        {},
        {
          baseURL: "https://localhost:7117/workflow",
          data: { roomId, dateFrom, dateTo, reason, description },
        }
      ),
    onSuccess: () => {
      reservations.refetch();
    },
  });

  return { reservations, createReservation };
};
