export type ChatActionType = "add_more" | "confirm" | "remove";

export type ChatMessageKind = "text" | "service" | "bill";

export interface ChatMessageAction {
  id: ChatActionType;
  label: string;
}

export interface ChatMessage {
  id: string;
  type: "incoming" | "outgoing";
  text: string;
  time: string;
  showAvatar?: boolean;
  kind?: ChatMessageKind;
  service?: MenuServiceItem;
  services?: MenuServiceItem[];
  totalBill?: string;
  actions?: ChatMessageAction[];
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
