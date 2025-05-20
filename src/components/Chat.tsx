"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
  id: string;
}

interface ChatProps {
  initialQuestion: string;
  onSendMessage?: (message: string) => Promise<string>;
}

export function Chat({ initialQuestion, onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [hasInitialMessageBeenSent, setHasInitialMessageBeenSent] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to scroll to bottom when new messages appear
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Send initial question on first render
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() !== "" && !hasInitialMessageBeenSent) {
      const userMessage: Message = {
        content: initialQuestion,
        isUser: true,
        id: `user-${Date.now()}`,
      };
      
      setMessages([userMessage]);
      handleSendMessage(initialQuestion);
      setHasInitialMessageBeenSent(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion, hasInitialMessageBeenSent]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!onSendMessage || !content.trim()) return;
    
    setLoading(true);
    try {
      const response = await onSendMessage(content);
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: response,
          isUser: false,
          id: `assistant-${Date.now()}`,
        },
      ]);
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: "Sorry, I couldn't process your request.",
          isUser: false,
          id: `error-${Date.now()}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || loading) return;
    
    const userMessage: Message = {
      content: newMessage,
      isUser: true,
      id: `user-${Date.now()}`,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    handleSendMessage(newMessage);
    setNewMessage("");
    
    // Focus input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-grow overflow-y-auto p-4 mb-4 bg-transparent"
      >
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-3 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-muted text-muted-foreground">
                <p className="text-sm">Finding the silver lining...</p>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
          className="flex-grow focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 