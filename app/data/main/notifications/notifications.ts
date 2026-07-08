export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const initialNotifications: AppNotification[] = [
  {
    id: "1",
    title: "Booking confirmed",
    message: "Your Swedish Massage with Sony is confirmed for May 22, 11:00 AM.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "Appointment reminder",
    message: "Hot Stone Massage tomorrow at 2:00 PM. Tap to view details.",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "New offer available",
    message: "Get 15% off your next spa package this weekend only.",
    time: "3h ago",
    read: true,
  },
  {
    id: "4",
    title: "Payment received",
    message: "We received your payment of $287. Receipt is in My Orders.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    title: "Expert replied",
    message: "Sony sent you a message about your upcoming session.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    title: "Seat confirmed",
    message: "Seat A3 is reserved for your visit on May 28.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "7",
    title: "Welcome to Velvetbook",
    message: "Explore top-rated experts and book your first treatment.",
    time: "1 week ago",
    read: true,
  },
];
