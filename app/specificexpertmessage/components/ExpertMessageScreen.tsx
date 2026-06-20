import { ExpertChatData } from "../message.types";
import { ChatBottomBookingBar } from "./ChatBottomBookingBar";
import { ChatConversation } from "./ChatConversation";
import { ChatHeader } from "./ChatHeader";
import { ChatTopNav } from "./ChatTopNav";
import { ExpertSummarySection } from "./ExpertSummarySection";
import { MenuSection } from "./MenuSection";
import { MessageComposer } from "./MessageComposer";
import { SelectServiceButton } from "./SelectServiceButton";

interface ExpertMessageScreenProps {
  chat: ExpertChatData;
}

export function ExpertMessageScreen({ chat }: ExpertMessageScreenProps) {
  return (
    <div className="relative pb-[110px]">
      <div className="space-y-3 px-2 pt-2">
        <ChatTopNav />
        <ExpertSummarySection expertId={chat.expertId} />

        <article className="feature-card rounded-xl p-3">
          <ChatHeader
            userName={chat.userName}
            userAvatar={chat.userAvatar}
          />
          <ChatConversation
            messages={chat.messages}
            userAvatar={chat.userAvatar}
            expertId={chat.expertId}
          />
          <MessageComposer />
        </article>

        <MenuSection items={chat.menuItems} />
        <SelectServiceButton />
      </div>

      <ChatBottomBookingBar totalPrice={chat.totalPrice} />
    </div>
  );
}
