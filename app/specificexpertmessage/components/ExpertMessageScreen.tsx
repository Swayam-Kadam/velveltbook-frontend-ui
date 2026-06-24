"use client";

import { useCallback, useState } from "react";

import {
  ChatActionType,
  ChatMessage,
  ExpertChatData,
  MenuServiceItem,
} from "../message.types";
import { ChatBottomBookingBar } from "./ChatBottomBookingBar";
import { ChatConversation } from "./ChatConversation";
import { ChatHeader } from "./ChatHeader";
import { ChatTopNav } from "./ChatTopNav";
import { ExpertSummarySection } from "./ExpertSummarySection";
import { MenuSection } from "./MenuSection";
import { MessageComposer } from "./MessageComposer";

interface ExpertMessageScreenProps {
  chat: ExpertChatData;
}

function parsePrice(price: string): number {
  return Number.parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

function formatTotal(services: MenuServiceItem[]): string {
  const total = services.reduce((sum, service) => sum + parsePrice(service.price), 0);
  return `$${total} USD`;
}

function createOrgPromptMessage(): ChatMessage {
  return {
    id: `msg-org-${Date.now()}`,
    type: "outgoing",
    text: "Would you like to confirm, add more, or remove this service?",
    time: "Just now",
    showAvatar: true,
    actions: [
      { id: "confirm", label: "Confirm" },
      { id: "add_more", label: "Add more" },
      { id: "remove", label: "Remove" },
    ],
  };
}

export function ExpertMessageScreen({ chat }: ExpertMessageScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages);
  const [selectedServices, setSelectedServices] = useState<MenuServiceItem[]>([]);
  const [awaitingAction, setAwaitingAction] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(chat.totalPrice);

  const addOrgPrompt = useCallback(() => {
    setMessages((prev) => [...prev, createOrgPromptMessage()]);
    setAwaitingAction(true);
  }, []);

  const handleAddService = useCallback(
    (item: MenuServiceItem) => {
      if (confirmed || awaitingAction) return;

      const userMessage: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        type: "incoming",
        kind: "service",
        service: item,
        text: "",
        time: "Just now",
        showAvatar: selectedServices.length === 0,
      };

      const updatedServices = [...selectedServices, item];

      setSelectedServices(updatedServices);
      setTotalPrice(formatTotal(updatedServices));
      setMessages((prev) => [...prev, userMessage]);
      addOrgPrompt();
    },
    [addOrgPrompt, awaitingAction, confirmed, selectedServices],
  );

  const handleAction = useCallback(
    (action: ChatActionType, messageId: string) => {
      if (confirmed) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? { ...message, actions: undefined } : message,
        ),
      );

      if (action === "add_more") {
        setAwaitingAction(false);
        return;
      }

      if (action === "confirm") {
        if (selectedServices.length === 0) return;

        const total = formatTotal(selectedServices);

        setConfirmed(true);
        setAwaitingAction(false);
        setTotalPrice(total);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-confirm-${Date.now()}`,
            type: "outgoing",
            kind: "bill",
            text: "Appointment confirmed!",
            services: selectedServices,
            totalBill: total,
            time: "Just now",
            showAvatar: true,
          },
        ]);
        return;
      }

      if (action === "remove") {
        if (selectedServices.length === 0) return;

        const removedService = selectedServices[selectedServices.length - 1];
        const updatedServices = selectedServices.slice(0, -1);

        setSelectedServices(updatedServices);
        setTotalPrice(
          updatedServices.length > 0 ? formatTotal(updatedServices) : chat.totalPrice,
        );

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-remove-${Date.now()}`,
            type: "incoming",
            kind: "service",
            service: removedService,
            text: "Remove",
            time: "Just now",
            showAvatar: false,
          },
        ]);

        if (updatedServices.length === 0) {
          setAwaitingAction(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-org-empty-${Date.now()}`,
              type: "outgoing",
              text: "Service removed. Select a service from the menu to continue.",
              time: "Just now",
              showAvatar: true,
            },
          ]);
          return;
        }

        addOrgPrompt();
      }
    },
    [addOrgPrompt, chat.totalPrice, confirmed, selectedServices],
  );

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
            messages={messages}
            userAvatar={chat.userAvatar}
            expertId={chat.expertId}
            onAction={handleAction}
          />
          <MessageComposer />
        </article>

        <MenuSection
          items={chat.menuItems}
          onAddService={handleAddService}
          canAddService={!awaitingAction && !confirmed}
        />
      </div>

      <ChatBottomBookingBar totalPrice={totalPrice} />
    </div>
  );
}
