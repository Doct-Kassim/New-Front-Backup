import React, { useEffect, useState, useRef, useContext } from "react";

import { Button, Form, InputGroup } from "react-bootstrap";

import { BsEmojiSmile, BsFillImageFill, BsFillCameraVideoFill, BsPaperclip } from "react-icons/bs";

import EmojiPicker from "emoji-picker-react";

import { AuthContext } from "../context/AuthContext";

const Forum = ({ roomId = 1 }) => {
  const { authTokens, user, authFetch } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = `http://127.0.0.1:8000/api/forum/rooms/${roomId}/messages/`;

  // Fetch messages
  const fetchMessages = async () => {
    if (!authTokens) return;

    try {
      const res = await authFetch(API_URL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [authTokens]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!authTokens || !user) return;

    try {
      const res = await authFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          sender: user.username, // or user.id if backend uses id
          room: roomId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data]);
        setNewMessage("");
      } else {
        console.error("Error sending message:", res.status);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Topbar */}
      <div className="bg-success text-white p-3 d-flex align-items-center">
        <h5 className="m-0">🌾 FarmerHub Forum</h5>
      </div>

      {/* Chat body */}
      <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#ece5dd" }}>
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex mb-2 ${msg.sender === user?.username ? "justify-content-end" : "justify-content-start"}`}>
            <div className={`p-2 rounded-3 shadow-sm ${msg.sender === user?.username ? "bg-success text-white" : "bg-white text-dark"}`} style={{ maxWidth: "60%" }}>
              {msg.content && <p className="m-0">{msg.content}</p>}
              {msg.image && <img src={msg.image} alt="img" className="img-fluid rounded mt-1" />}
              {msg.video && <video src={msg.video} controls className="img-fluid rounded mt-1" />}
              {msg.file && <a href={msg.file} target="_blank" rel="noreferrer">📎 {msg.file}</a>}
              {msg.voice_note && <audio src={msg.voice_note} controls />}
              <small className="d-block text-end text-muted" style={{ fontSize: "0.7rem" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <Form onSubmit={sendMessage} className="p-2 bg-light">
        <InputGroup>
          <Button variant="outline-secondary" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <BsEmojiSmile />
          </Button>
          {showEmojiPicker && (
            <div style={{ position: "absolute", bottom: "60px", left: "20px", zIndex: 10 }}>
              <EmojiPicker onEmojiClick={(e) => setNewMessage(newMessage + e.emoji)} />
            </div>
          )}
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="outline-secondary"><BsFillImageFill /></Button>
          <Button variant="outline-secondary"><BsFillCameraVideoFill /></Button>
          <Button variant="outline-secondary"><BsPaperclip /></Button>
          <Button type="submit" variant="success">Send</Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default Forum;
