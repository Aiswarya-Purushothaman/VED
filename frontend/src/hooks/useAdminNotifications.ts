import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:3001";

export interface NewBookingPayload {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  packageName: string | null;
  eventDate: string;
  venue: string;
  requestedAddons: string[];
  specialNotes: string | null;
}

export interface PendingReminderItem {
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  eventDate: string;
  status: string;
}

export interface PendingReminderPayload {
  pendingCount: number;
  inProgressCount: number;
  bookings: PendingReminderItem[];
}

export function useAdminNotifications(
  token: string | null,
  onNewBooking: (data: NewBookingPayload) => void,
  onPendingReminder: (data: PendingReminderPayload) => void,
) {
  const socketRef = useRef<Socket | null>(null);
  const onNewBookingRef = useRef(onNewBooking);
  onNewBookingRef.current = onNewBooking;
  const onPendingReminderRef = useRef(onPendingReminder);
  onPendingReminderRef.current = onPendingReminder;

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinAdmin", token);
    });

    socket.on("newBooking", (data: NewBookingPayload) => {
      onNewBookingRef.current(data);
    });

    socket.on("pendingReminder", (data: PendingReminderPayload) => {
      onPendingReminderRef.current(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);
}
