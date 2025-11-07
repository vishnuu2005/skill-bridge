import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/messages/conversations');
        setConversations(response.data);
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/messages/conversations/${selectedConversation.id}`);
          setMessages(response.data);
        } catch (err) {
          setError('Failed to load messages');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`/api/messages/users/search?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error('Failed to search users:', err);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const receiverId = selectedConversation.otherUser._id;
      await axios.post('/api/messages/send', {
        receiverId,
        content: newMessage
      });

      // Optimistically add message to UI
      setMessages([...messages, {
        sender: user.id,
        content: newMessage,
        timestamp: new Date()
      }]);

      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  const startNewConversation = async (receiverId) => {
    try {
      // Send initial message
      await axios.post('/api/messages/send', {
        receiverId,
        content: 'Hi! I would like to connect with you.'
      });

      // Refresh conversations
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data);
      
      // Clear search
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Failed to start conversation');
      console.error(err);
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(user => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => startNewConversation(user._id)}
              >
                {user.avatar && <img src={user.avatar} alt={user.name} className="user-avatar" />}
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="conversations">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              {conv.otherUser.avatar && (
                <img src={conv.otherUser.avatar} alt={conv.otherUser.name} className="user-avatar" />
              )}
              <div className="conversation-info">
                <h4>{conv.otherUser.name}</h4>
                <p>{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="message-area">
        {selectedConversation ? (
          <>
            <div className="message-header">
              <h3>{selectedConversation.otherUser.name}</h3>
            </div>

            <div className="messages-list">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.content}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <h3>Select a conversation or start a new one</h3>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default Messages;