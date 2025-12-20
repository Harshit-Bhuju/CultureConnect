import React, { useState, useEffect, useRef } from "react";
import { X, Search, Phone, Video, Info, Send, Smile, Paperclip, MoreVertical, ArrowLeft, Camera } from "lucide-react";

const Message = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Manjil Shrestha",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Hey, are we practicing Kathak today?",
      time: "2:45 PM",
      unread: 3,
      online: true,
      messages: [
        { id: 1, text: "Hey! How are you?", sender: "them", time: "2:30 PM" },
        { id: 2, text: "I'm good! What about you?", sender: "me", time: "2:35 PM" },
        { id: 3, text: "Hey, are we practicing Kathak today?", sender: "them", time: "2:45 PM" }
      ]
    },
    {
      id: 2,
      name: "Anita Gurung",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessage: "The flute notes you sent were perfect! 🎶",
      time: "Yesterday",
      unread: 0,
      online: true,
      messages: [
        { id: 1, text: "Did you get the flute notes?", sender: "me", time: "Yesterday 3:00 PM" },
        { id: 2, text: "The flute notes you sent were perfect! 🎶", sender: "them", time: "Yesterday 3:30 PM" }
      ]
    },
    {
      id: 3,
      name: "Rajesh Dai",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      lastMessage: "Class starts at 6 PM sharp",
      time: "Monday",
      unread: 1,
      online: false,
      messages: [
        { id: 1, text: "What time is class tomorrow?", sender: "me", time: "Monday 10:00 AM" },
        { id: 2, text: "Class starts at 6 PM sharp", sender: "them", time: "Monday 10:15 AM" }
      ]
    },
    {
      id: 4,
      name: "Cultural Arts Group",
      avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
      lastMessage: "Saraswoti: Can't wait for Dashain event!",
      time: "Sunday",
      unread: 8,
      online: false,
      isGroup: true,
      messages: [
        { id: 1, text: "Who's coming to the Dashain event?", sender: "them", time: "Sunday 2:00 PM", senderName: "Ram" },
        { id: 2, text: "I'll be there!", sender: "me", time: "Sunday 2:15 PM" },
        { id: 3, text: "Can't wait for Dashain event!", sender: "them", time: "Sunday 2:30 PM", senderName: "Saraswoti" }
      ]
    }
  ]);

  const sidebarRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus input when conversation is selected
  useEffect(() => {
    if (selectedConversation && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedConversation]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: "me",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            time: "Just now"
          };
        }
        return conv;
      })
    );

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    setMessageText("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage = {
        id: Date.now() + 1,
        text: getAutoResponse(),
        sender: "them",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        senderName: selectedConversation.isGroup ? getRandomName() : undefined
      };

      setConversations(prevConvs =>
        prevConvs.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, responseMessage],
              lastMessage: responseMessage.text,
              time: "Just now"
            };
          }
          return conv;
        })
      );

      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, responseMessage]
      }));
    }, 2000);
  };

  const getAutoResponse = () => {
    const responses = [
      "That sounds great!",
      "I agree! 👍",
      "Let me check and get back to you",
      "Perfect timing!",
      "Thanks for letting me know",
      "See you there!",
      "That works for me",
      "Absolutely!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getRandomName = () => {
    const names = ["Ram", "Sita", "Saraswoti", "Krishna", "Maya"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const handleConversationClick = (conv) => {
    setSelectedConversation(conv);
    
    // Mark as read
    setConversations(prevConvs =>
      prevConvs.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)
    );
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        {!selectedConversation ? (
          // Conversations List View
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 pb-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Messages</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-3 bg-white/20 rounded-full text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleConversationClick(conv)}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                      {conv.isGroup && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">G</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unread > 0 && (
                      <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          // Chat View
          <>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{selectedConversation.name}</h3>
                  <p className="text-xs text-white/80">
                    {selectedConversation.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] ${msg.sender === "me" ? "order-2" : "order-1"}`}>
                    {msg.sender === "them" && selectedConversation.isGroup && msg.senderName && (
                      <p className="text-xs text-gray-600 mb-1 px-1">{msg.senderName}</p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.sender === "me"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 px-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  ref={messageInputRef}
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Message;