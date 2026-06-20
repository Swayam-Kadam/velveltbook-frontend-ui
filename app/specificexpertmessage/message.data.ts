import { ExpertChatData } from "./message.types";

const defaultMenuItems = [
  {
    id: "m1",
    name: "Deep Tissue",
    price: "$200",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=100&fit=crop",
  },
  {
    id: "m2",
    name: "Simple",
    price: "$80",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100&h=100&fit=crop",
  },
  {
    id: "m3",
    name: "Eastern Matek",
    price: "$170",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=100&h=100&fit=crop",
  },
  {
    id: "m4",
    name: "Oil Massage",
    price: "$80",
    image:
      "https://images.unsplash.com/photo-1596178065880-2314bdb1a0b8?w=100&h=100&fit=crop",
  },
  {
    id: "m5",
    name: "Tight Hugs",
    price: "$90",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&h=100&fit=crop",
  },
];

const defaultMessages = [
  {
    id: "msg1",
    type: "incoming" as const,
    text: "Hello! Can I get service?",
    time: "7 mins",
    showAvatar: true,
  },
  {
    id: "msg2",
    type: "incoming" as const,
    text: "Manicure, Haircut & Shaving",
    time: "5 mins",
    showAvatar: false,
  },
  {
    id: "msg3",
    type: "outgoing" as const,
    text: "Sure. What are you after?",
    time: "5 mins",
  },
  {
    id: "msg4",
    type: "outgoing" as const,
    text: "OK! I will add services & book you now :)",
    time: "2 mins",
    showAvatar: true,
  },
];

export const expertChats: Record<string, ExpertChatData> = {
  e1: {
    expertId: "e1",
    userName: "Suraj",
    userAvatar: "/profile.jpeg",
    totalPrice: "$147 USD",
    messages: defaultMessages,
    menuItems: defaultMenuItems,
  },
  e2: {
    expertId: "e2",
    userName: "Suraj",
    userAvatar: "/profile.jpeg",
    totalPrice: "$147 USD",
    messages: defaultMessages,
    menuItems: defaultMenuItems,
  },
  e3: {
    expertId: "e3",
    userName: "Suraj",
    userAvatar: "/profile.jpeg",
    totalPrice: "$147 USD",
    messages: defaultMessages,
    menuItems: defaultMenuItems,
  },
};

export function getExpertChat(expertId: string): ExpertChatData {
  return expertChats[expertId] ?? expertChats.e1;
}
