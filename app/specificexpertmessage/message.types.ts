export interface ChatMessage {
  id: string;
  type: "incoming" | "outgoing";
  text: string;
  time: string;
  showAvatar?: boolean;
}

export interface MenuServiceItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface ExpertChatData {
  expertId: string;
  userName: string;
  userAvatar: string;
  totalPrice: string;
  messages: ChatMessage[];
  menuItems: MenuServiceItem[];
}
