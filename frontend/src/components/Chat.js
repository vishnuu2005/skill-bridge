import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

const Chat = ({ chatId, onClose }) => {
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (chatId && user) {
      loadChat();
      socket.emit('join_chat', chatId);
    }

    // Socket listeners
    socket.on('receive_message', (data) => {
      if (data.chatId === chatId) {
        loadChat();
      }
    });

    socket.on('user_typing', (data) => {
      if (data.chatId === chatId) {
        setTyping(true);
      }
    });

    socket.on('user_stop_typing', (data) => {
      if (data.chatId === chatId) {
        setTyping(false);
      }
    });

    return () => {
      if (chatId) {
        socket.emit('leave_chat', chatId);
      }
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [chatId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChat(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chat:', error);
      setLoading(false);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { chatId, userName: user.name });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { chatId });
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/chats/${chatId}/message`,
        { content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setChat(response.data);
      setMessage('');
      
      // Emit socket event for real-time update
      socket.emit('send_message', {
        chatId,
        message: message,
        sender: user.name,
        timestamp: new Date()
      });
      
      socket.emit('stop_typing', { chatId });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-container">
        <LoadingSpinner message="Loading chat..." size="small" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="chat-container">
        <div className="chat-error">Chat not found</div>
      </div>
    );
  }

  const otherUser = chat.jobPoster._id === user.id ? chat.applicant : chat.jobPoster;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>{otherUser.name || otherUser.fullName || 'User'}</h3>
          <p className="chat-job-title">{chat.jobTitle}</p>
        </div>
        <button className="chat-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {chat.messages.length === 0 ? (
          <div className="chat-no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chat.messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === user.id ? 'chat-message-own' : 'chat-message-other'}`}
            >
              <div className="chat-message-content">
                {msg.sender !== user.id && (
                  <span className="chat-message-sender">{msg.senderName}</span>
                )}
                <p>{msg.content}</p>
                <span className="chat-message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {typing && (
          <div className="chat-typing-indicator">
            <span>{otherUser.name || otherUser.fullName || 'User'} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!message.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
