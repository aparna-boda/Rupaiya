import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useChat } from '../hooks/useChat';
import { useKnowledge } from '../hooks/useKnowledge';
import { formatINRFull, getFirstName } from '../utils/formatters';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import ChatBubble from '../components/features/ChatBubble';
import Button from '../components/ui/Button';

export default function AskAnything() {
  const { profile } = useProfile();
  const { messages, isLoading, error, sendMessage } = useChat();
  const { data: knowledge } = useKnowledge();
  const [input, setInput] = useState('');
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const prefilled = (location.state as { prefilled?: string } | null)?.prefilled;

  const quickQuestions = knowledge?.faqs.map((f) => f.question) ?? [];

  const firstName = getFirstName(profile.name);
  const greeting = firstName ? `Hey ${firstName}!` : 'Hey!';
  const openingMessage = `${greeting} I'm your finance buddy. You earn ${formatINRFull(profile.monthlyIncome)}/month and you're starting with ${formatINRFull(profile.monthlyInvestment)}/month — that's a solid move at ${profile.age}. Ask me anything.`;

  useEffect(() => {
    if (prefilled) setInput(prefilled);
  }, [prefilled]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const message = text ?? input;
    if (!message.trim()) return;
    setInput('');
    setChipsVisible(false);
    await sendMessage(message);
  };

  const userMessages = messages.filter((m) => m.role === 'user');

  return (
    <PageWrapper title="Ask Anything">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Ask Anything"
          description="Your finance buddy — plain answers, no judgment, Indian context."
        />

        <div className="flex flex-col min-h-[40vh] mb-4">
          <ChatBubble role="assistant" content={openingMessage} />

          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-secondary-soft px-4 py-3 rounded-lg text-sm text-muted">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-center py-2" style={{ color: 'var(--color-risk-3-text)' }}>
              {error}
            </p>
          )}

          {chipsVisible && userMessages.length === 0 && quickQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-sm px-3 py-2 bg-sunken border border-border rounded-pill text-secondary-text hover-chip text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 py-4 bg-bg border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about money..."
              className="flex-1 bg-sunken border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
