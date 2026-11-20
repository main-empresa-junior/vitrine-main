import { ChatBubble } from './ChatBubble';
import { TypingDots } from './TypingDots';

export function TypingIndicator() {
  return (
    <ChatBubble author="orbi">
      <span className="flex h-5 items-center">
        <TypingDots />
        <span className="sr-only">Orbi está digitando</span>
      </span>
    </ChatBubble>
  );
}
