
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { streamChatMessage } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon, UserIcon } from './icons/Icons';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai', isTyping: true }]);

    let streamedText = '';
    await streamChatMessage(input, (chunk) => {
        streamedText += chunk;
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: streamedText, isTyping: true } : msg
        ));
    });

    setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, isTyping: false } : msg
    ));
    setIsLoading(false);
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center">
        <SparklesIcon className="h-6 w-6 text-brand-blue" />
        <h2 className="text-xl font-bold text-slate-800 ml-2">AIアシスタント</h2>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 ? (
           <div className="text-center text-slate-500">
             <p className="mb-2">院内プロトコルや医療情報について質問してください。</p>
             <p className="text-sm">例: 「アナフィラキシーショックの初期対応プロトコルは？」</p>
           </div>
        ) : (
            messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-slate-200 text-slate-800 rounded-br-none' : 'bg-brand-blue-light text-slate-900 rounded-bl-none'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        {msg.isTyping && <span className="inline-block w-2 h-2 ml-2 bg-slate-500 rounded-full animate-pulse"></span>}
                    </div>
                     {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-5 h-5 text-slate-600" />
                        </div>
                    )}
                </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="メッセージを入力..."
            className="w-full pl-4 pr-12 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-brand-blue disabled:bg-slate-300 hover:bg-brand-blue-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
