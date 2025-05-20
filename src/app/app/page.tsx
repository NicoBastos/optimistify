"use client";

import { useState, useEffect } from 'react';
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Chat } from "@/components/Chat";
import { APIError } from '@/lib/api-error';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Apply dark theme immediately on page load
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
}

export default function AppPage() {
  const [text, setText] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [initialText, setInitialText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  useEffect(() => {
    // Ensure dark theme is applied on initial render
    document.documentElement.classList.add('dark');
  }, []);
  
  // Function to switch from dark to light theme
  const switchToLightTheme = () => {
    document.documentElement.classList.remove('dark');
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      setError(null);
      const res = await fetch('/api/optimistify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: message,
          conversationHistory 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new APIError(data.error || 'Failed to process request', res.status);
      }

      // Update conversation history with the new messages
      setConversationHistory(data.conversationHistory);
      return data.text;
    } catch (error) {
      const apiError = error instanceof APIError ? error : new APIError('Failed to process request');
      setError(apiError.message);
      throw apiError;
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      setError(null);
      setInitialText(text);
      setChatStarted(true);
      // Switch to light theme only after user clicks 'Reframe'
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-background text-foreground">
      <div 
        className={`flex flex-col items-center w-1/2 transition-all duration-500 ease-in-out ${
          chatStarted 
            ? 'opacity-0 scale-95 pointer-events-none absolute' 
            : 'opacity-100 scale-100'
        }`}
      >
        <Textarea
          className="w-full bg-muted focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
          placeholder="Transform your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <Button 
          onClick={handleSubmit} 
          className="mt-4 w-full"
          disabled={!text.trim()}
        >
          Brighten My Perspective
        </Button>
      </div>
      <div 
        className={`w-3/4 h-[80vh] transition-all duration-500 ease-in-out ${
          !chatStarted 
            ? 'opacity-0 scale-95 pointer-events-none absolute' 
            : 'opacity-100 scale-100'
        }`}
      >
        <Chat initialQuestion={initialText} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
} 