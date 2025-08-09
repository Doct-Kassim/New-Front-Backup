import React, { useState, useRef, useEffect, useContext } from 'react';

import { Card, Form, Button, InputGroup } from 'react-bootstrap';

import { BsFillSendFill, BsEmojiSmile, BsPaperclip, BsFillMicFill, BsArrowLeft } from 'react-icons/bs';

import Picker from 'emoji-picker-react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!user) {
      alert('Please login to send messages.');
      return;
    }
    if (text.trim()) {
      const newMessage = {
        text,
        sender: user.first_name + ' ' + user.last_name,
        time: new Date().toLocaleTimeString(),
        initials: (user.first_name[0] + user.last_name[0]).toUpperCase(),
      };
      setMessages([...messages, newMessage]);
      setText('');
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ height: '100vh', position: 'relative', backgroundColor: '#e5ddd5' }}
    >
      <Card
        className="flex-grow-1 rounded-0 d-flex flex-column"
        style={{ backgroundColor: '#e5ddd5' }}
      >
        {/* Back arrow button */}
        <div className="p-2 border-bottom bg-light d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            style={{ fontSize: '1.5rem', color: '#333' }}
          >
            <BsArrowLeft />
          </Button>
          <h5 className="mb-0 ms-2">Community Forum</h5>
        </div>

        {/* Chat Scrollable Area */}
        <div
          ref={scrollContainerRef}
          className="flex-grow-1 overflow-auto px-3 py-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((msg, idx) => {
            const isCurrentUser =
              user && msg.sender === user.first_name + ' ' + user.last_name;

            return (
              <div
                key={idx}
                className={`mb-2 d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
                style={{ alignItems: 'flex-start' }}
              >
                {/* Avatar always on left */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: '35px',
                    height: '35px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    marginRight: '8px',
                    order: 0,
                  }}
                >
                  {msg.initials || msg.sender.charAt(0).toUpperCase()}
                </div>

                {/* Message bubble */}
                <div
                  className="rounded px-3 py-2 shadow-sm"
                  style={{
                    maxWidth: '75%',
                    backgroundColor: isCurrentUser ? '#dcf8c6' : '#fff',
                    color: '#000',
                    order: 1,
                  }}
                >
                  <strong>{msg.sender}</strong>
                  <div>{msg.text}</div>
                  <small className="text-muted">{msg.time}</small>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="position-absolute bottom-100 mb-2 start-0">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </Card>

      {/* Input Bar Fixed at Bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6',
          padding: '0.5rem 1rem',
          zIndex: 1050,
        }}
      >
        <InputGroup>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <BsEmojiSmile />
          </Button>
          <Button variant="outline-secondary">
            <BsPaperclip />
          </Button>
          <Form.Control
            placeholder={user ? 'Andika ujumbe...' : 'Please login to chat'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!user}
            style={{ borderRadius: '30px' }}
          />
          <Button variant="outline-secondary">
            <BsFillMicFill />
          </Button>
          <Button variant="success" onClick={handleSend} disabled={!user}>
            <BsFillSendFill />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default Forum;
