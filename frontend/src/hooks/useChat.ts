import { useCallback } from 'react';
import { sendChatMessage } from '../api/client';
import { useChatStore } from '../store/chatStore';
import { useProfileStore } from '../store/profileStore';
import type { Message } from '../types/chat';

function createMessage(role: Message['role'], content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}

export function useChat() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
  const setError = useChatStore((s) => s.setError);
  const profile = useProfileStore((s) => s.profile);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage = createMessage('user', trimmed);
      addMessage(userMessage);
      setLoading(true);
      setError(null);

      try {
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const reply = await sendChatMessage({
          message: trimmed,
          history,
          userProfile: profile,
        });

        addMessage(createMessage('assistant', reply));
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [messages, isLoading, addMessage, setLoading, setError, profile]
  );

  return { messages, isLoading, error, sendMessage };
}
