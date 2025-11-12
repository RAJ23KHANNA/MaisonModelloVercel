import { Search, Send, MoreVertical, Phone, Video, Paperclip, Image as ImageIcon, Smile } from 'lucide-react';
import { useState } from 'react';

interface MessagingProps {
  onNavigate: (page: string) => void;
}

export function Messaging({ onNavigate }: MessagingProps) {
  const [selectedChat, setSelectedChat] = useState(0);

  const conversations = [
    {
      id: 0,
      name: 'Maison Élégance',
      type: 'Designer',
      lastMessage: 'Thank you for your interest! We\'d love to discuss the opportunity further.',
      time: '10m ago',
      unread: 2,
      online: true,
    },
    {
      id: 1,
      name: 'Sophie Bernard',
      type: 'Talent Manager',
      lastMessage: 'The casting is scheduled for next Tuesday at 2 PM.',
      time: '1h ago',
      unread: 0,
      online: true,
    },
    {
      id: 2,
      name: 'Marcus Chen',
      type: 'Model',
      lastMessage: 'Hey! How was the photoshoot yesterday?',
      time: '3h ago',
      unread: 1,
      online: false,
    },
    {
      id: 3,
      name: 'Urban Thread Studio',
      type: 'Designer',
      lastMessage: 'We\'re impressed with your portfolio. Are you available for a collaboration?',
      time: '1d ago',
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: 'Isabella Martinez',
      type: 'Model',
      lastMessage: 'Thanks for the recommendation! 🙏',
      time: '2d ago',
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'them',
      content: 'Hi! Thank you for applying to our Fashion Week casting. We were very impressed with your portfolio.',
      time: '2:30 PM',
    },
    {
      id: 2,
      sender: 'me',
      content: 'Thank you so much! I\'m really excited about this opportunity.',
      time: '2:32 PM',
    },
    {
      id: 3,
      sender: 'them',
      content: 'We\'d love to schedule a video call to discuss the details. Are you available this Friday afternoon?',
      time: '2:35 PM',
    },
    {
      id: 4,
      sender: 'me',
      content: 'Yes, Friday afternoon works perfectly for me! What time would be best for you?',
      time: '2:36 PM',
    },
    {
      id: 5,
      sender: 'them',
      content: 'Thank you for your interest! We\'d love to discuss the opportunity further.',
      time: '2:38 PM',
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid lg:grid-cols-12 h-full">
          {/* Conversations List */}
          <div className="lg:col-span-4 bg-white border-r border-neutral-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-neutral-900 mb-4">Messages</h2>
              <div className="relative">
                <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 flex items-start gap-4 hover:bg-neutral-50 transition border-b border-neutral-100 ${
                    selectedChat === conv.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-neutral-900 truncate">{conv.name}</h3>
                      <span className="text-neutral-500 text-xs flex-shrink-0">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-neutral-600 text-sm truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-xs flex-shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-500 text-xs">{conv.type}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-t border-neutral-200">
              <button
                onClick={() => onNavigate('search')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition"
              >
                New Chat
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 bg-white flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <button
                    onClick={() => onNavigate('designer-profile')}
                    className="text-neutral-900 hover:text-amber-600"
                  >
                    {conversations[selectedChat].name}
                  </button>
                  <div className="text-neutral-600 text-sm">{conversations[selectedChat].type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-lg ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'them' && (
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0"></div>
                    )}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`text-xs text-neutral-500 mt-1 ${message.sender === 'me' ? 'text-right' : ''}`}>
                        {message.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attachment Preview (optional) */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3 text-neutral-600 text-sm">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg transition">
                  <Paperclip className="w-4 h-4" />
                  <span>Attach</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg transition">
                  <ImageIcon className="w-4 h-4" />
                  <span>Photo</span>
                </button>
                <button
                  onClick={() => onNavigate('job')}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg transition"
                >
                  <span>📋</span>
                  <span>Share Job Post</span>
                </button>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-neutral-200">
              <div className="flex items-end gap-3">
                <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                  <Smile className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
                <button className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
