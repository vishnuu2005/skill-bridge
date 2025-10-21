import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Chat from './Chat';
import './DirectChatList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DirectChatList = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/direct-chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading direct chats:', error);
      setLoading(false);
    }
  };

  const getOtherUser = (chat) => {
    return chat.participants.find(p => p._id !== user.id);
  };

  const getUnreadCount = (chat) => {
    if (chat.unreadCount && chat.unreadCount[user.id] !== undefined) {
      return chat.unreadCount[user.id];
    }
    return 0;
  };

  const handleChatClick = (chat) => {
    setSelectedChatId(chat._id);
    setSelectedChat(chat);
  };

  if (loading) {
    return (
      <div className="direct-chatlist-container">
        <div className="direct-chatlist-loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="direct-chatlist-container">
      <div className="direct-chatlist-header">
        <h2>💬 Direct Messages</h2>
        <span className="direct-chatlist-count">{chats.length} conversations</span>
      </div>

      {chats.length === 0 ? (
        <div className="direct-chatlist-empty">
          <div className="direct-chatlist-empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start a conversation with other users from their profile or skill portal!</p>
        </div>
      ) : (
        <div className="direct-chatlist-items">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const unreadCount = getUnreadCount(chat);
            
            return (
              <div
                key={chat._id}
                className="direct-chatlist-item"
                onClick={() => handleChatClick(chat)}
              >
                <div className="direct-chatlist-item-avatar">
                  {otherUser?.name?.charAt(0).toUpperCase() || otherUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="direct-chatlist-item-content">
                  <div className="direct-chatlist-item-header">
                    <h4>{otherUser?.name || otherUser?.fullName || 'User'}</h4>
                    {unreadCount > 0 && (
                      <span className="direct-chatlist-unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="direct-chatlist-item-preview">{chat.lastMessage}</p>
                  )}
                  <span className="direct-chatlist-item-time">
                    {new Date(chat.lastMessageTime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Chat Modal */}
      {selectedChatId && selectedChat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <DirectChatWindow
              chat={selectedChat}
              chatId={selectedChatId}
              onClose={() => {
                setSelectedChatId(null);
                setSelectedChat(null);
                loadChats(); // Refresh chat list
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// DirectChatWindow component for the chat interface
const DirectChatWindow = ({ chat, chatId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = React.useRef(null);

  const otherUser = chat.participants.find(p => p._id !== user.id);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/direct-chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/direct-chats/${chatId}/message`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(response.data.messages || []);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="direct-chat-window">
        <div className="chat-header">
          <h3>Loading...</h3>
          <button className="chat-close-btn" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div className="direct-chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>{otherUser?.name || otherUser?.fullName || 'User'}</h3>
          <p className="chat-user-email">{otherUser?.email || ''}</p>
        </div>
        <button className="chat-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === user.id ? 'chat-message-own' : 'chat-message-other'} ${msg.isAdmin ? 'chat-message-admin' : ''}`}
            >
              <div className="chat-message-content">
                {msg.sender !== user.id && (
                  <div className="chat-message-header">
                    <span className="chat-message-sender">{msg.senderName}</span>
                    {msg.isAdmin && <span className="chat-admin-badge">ADMIN</span>}
                  </div>
                )}
                {msg.sender === user.id && msg.isAdmin && (
                  <div className="chat-message-header-own">
                    <span className="chat-admin-badge">ADMIN</span>
                  </div>
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
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!newMessage.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default DirectChatList;
