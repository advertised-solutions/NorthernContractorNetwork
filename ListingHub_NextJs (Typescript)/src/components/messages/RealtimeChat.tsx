'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Message } from '@/types';

interface RealtimeChatProps {
  conversationId: string;
}

export default function RealtimeChat({ conversationId }: RealtimeChatProps) {
  const { messages, loading, error } = useRealtimeMessages({ conversationId });
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      const response = await api.post(`/messages/${conversationId}`, {
        content: messageText.trim(),
      });

      if (response.success) {
        setMessageText('');
      } else {
        console.error('Error sending message:', response.error);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading messages: {error.message}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Messages List */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '500px' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted p-4">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message: Message) => {
            const isOwnMessage = message.senderId === currentUser?.uid;
            return (
              <div
                key={message.id}
                className={`mb-3 d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`rounded p-3 ${
                    isOwnMessage ? 'bg-primary text-white' : 'bg-light'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  {!isOwnMessage && message.senderName && (
                    <div className="small mb-1 fw-bold">{message.senderName}</div>
                  )}
                  <div>{message.content}</div>
                  <div
                    className={`small mt-1 ${
                      isOwnMessage ? 'text-white-50' : 'text-muted'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-top p-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sending}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              <i className="fa-regular fa-paper-plane"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

