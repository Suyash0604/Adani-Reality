import { useEffect, useRef } from 'react';

const placeholderBubbles = [
  { id: 'p1', side: 'left', text: 'Agent: Hello, thank you for choosing Adani Realty.' },
  { id: 'p2', side: 'right', text: 'Customer: Hmm okay, I am exploring options in Pune.' },
  { id: 'p3', side: 'left', text: 'Agent: Sure, may I confirm your budget range and timeline?' },
];

const TranscriptPanel = ({ messages, callState }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isEnded = callState === 'ended';
  const showTyping = callState === 'active' && messages.length > 0;

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-[#0A2C5E]">Live Transcript</h2>
        {isEnded ? (
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Call ended • Transcript complete</div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D71920]/10 px-3 py-1 text-xs font-semibold text-[#D71920]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D71920] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D71920] shadow-[0_0_8px_2px_rgba(215,25,32,0.45)]" />
            </span>
            LIVE
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
        {messages.length === 0 ? (
          <>
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/80 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">No active conversation</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>Agent messages appear on left</li>
                <li>Customer responses appear on right</li>
                <li>AI listens and assists in real-time</li>
              </ul>
            </div>

            {placeholderBubbles.map((item) => (
              <div key={item.id} className={`flex ${item.side === 'left' ? 'justify-start' : 'justify-end'} opacity-45`}>
                <div className="max-w-[80%] rounded-2xl bg-slate-200 px-3 py-2 text-xs text-slate-600">{item.text}</div>
              </div>
            ))}
          </>
        ) : (
          messages.map((message, idx) => {
            const prev = messages[idx - 1];
            const grouped = prev && prev.sender === message.sender;
            return (
              <div key={message.id} className={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'} ${grouped ? 'mt-1' : 'mt-3'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.sender === 'agent' ? 'bg-[#0A2C5E] text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="mt-1 text-right text-[10px] opacity-80">{message.time}</p>
                </div>
              </div>
            );
          })
        )}

        {showTyping ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:140ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:280ms]" />
            <span className="ml-2">Customer is typing...</span>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </section>
  );
};

export default TranscriptPanel;
