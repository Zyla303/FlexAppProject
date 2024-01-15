import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { get, httpDelete, post } from "../http-factory";
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
  const queryClient = useQueryClient();

  const reservations = useQuery<Reservation[]>({
    queryKey: ["reservations", roomId],
    queryFn: ({ queryKey: [, roomId] }) =>
      get("/Reservations/ListOfReservations", {
        params: { roomId },
        baseURL: "https://localhost:7117/workflow",
      }),
  });

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

  const deleteReservation = useMutation<
    Reservation,
    DefaultError,
    Pick<Reservation, "id">
  >({
    mutationFn: ({ id: reservationId }) =>
      httpDelete("/Reservations/RemoveReservation", {
        params: { reservationId },
        baseURL: "https://localhost:7117/workflow",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  return { reservations, createReservation, deleteReservation };
};
