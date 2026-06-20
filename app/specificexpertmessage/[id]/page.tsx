import { ExpertMessageScreen } from "../components/ExpertMessageScreen";
import { expertChats, getExpertChat } from "../message.data";

interface ExpertMessagePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(expertChats).map((id) => ({ id }));
}

export default async function ExpertMessagePage({
  params,
}: ExpertMessagePageProps) {
  const { id } = await params;
  const chat = getExpertChat(id);

  return (
    <main>
      <ExpertMessageScreen chat={chat} />
    </main>
  );
}
