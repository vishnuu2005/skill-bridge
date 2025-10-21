import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Chat from './Chat';
import './ChatList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatList = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chats:', error);
      setLoading(false);
    }
  };

  const getOtherUser = (chat) => {
    return chat.jobPoster._id === user.id ? chat.applicant : chat.jobPoster;
  };

  const getUnreadCount = (chat) => {
    return chat.jobPoster._id === user.id 
      ? chat.unreadCount.jobPoster 
      : chat.unreadCount.applicant;
  };

  if (loading) {
    return (
      <div className="chatlist-container">
        <div className="chatlist-loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chatlist-container">
      <div className="chatlist-header">
        <h2>My Chats</h2>
        <span className="chatlist-count">{chats.length} conversations</span>
      </div>

      {chats.length === 0 ? (
        <div className="chatlist-empty">
          <div className="chatlist-empty-icon">💬</div>
          <h3>No chats yet</h3>
          <p>Start a conversation by clicking the chat button on a job posting!</p>
        </div>
      ) : (
        <div className="chatlist-items">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const unreadCount = getUnreadCount(chat);
            
            return (
              <div
                key={chat._id}
                className="chatlist-item"
                onClick={() => setSelectedChatId(chat._id)}
              >
                <div className="chatlist-item-avatar">
                  {otherUser.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="chatlist-item-content">
                  <div className="chatlist-item-header">
                    <h4>{otherUser.fullName}</h4>
                    {unreadCount > 0 && (
                      <span className="chatlist-unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  <p className="chatlist-item-job">{chat.jobTitle}</p>
                  {chat.lastMessage && (
                    <p className="chatlist-item-preview">{chat.lastMessage}</p>
                  )}
                  <span className="chatlist-item-time">
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

      {/* Chat Modal */}
      {selectedChatId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Chat 
              chatId={selectedChatId} 
              onClose={() => {
                setSelectedChatId(null);
                loadChats(); // Refresh chat list
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
