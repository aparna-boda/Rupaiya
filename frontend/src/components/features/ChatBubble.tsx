import type { MessageRole } from '../../types/chat';

interface ChatBubbleProps {
  role: MessageRole;
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-secondary-soft text-ink rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
