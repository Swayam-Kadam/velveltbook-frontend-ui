export interface ExpertChatSeedMessage {
  id: string;
  text: string;
  time: string;
  outgoing: boolean;
}

export const EXPERT_CHAT_SEED_MESSAGES: ExpertChatSeedMessage[] = [
  { id: "m1", text: "Hello! Can I get service?", time: "7 mins", outgoing: false },
  { id: "m2", text: "Manicure, Haircut & Shaving", time: "5 mins", outgoing: false },
  { id: "m3", text: "Sure. What are you after?", time: "5 mins", outgoing: true },
  {
    id: "m4",
    text: "OK! I will add services & book you now :)",
    time: "2 mins",
    outgoing: true,
  },
];
