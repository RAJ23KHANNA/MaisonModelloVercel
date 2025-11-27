import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Type definitions for clarity
interface Profile {
  id: string;
  full_name: string;
  role: string;
  profile_image: string | null;
}

interface Conversation {
  id: string; // The other user's ID
  name: string;
  type: string;
  profile_image: string | null;
  lastMessage: string;
  lastMessageTime: Date; 
  unreadCount: number; // Now relies on DB 'is_read' column
}

export function MessagingUnified() {
  const { id: activeChatId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const activeChat = useMemo(() => {
    return conversations.find((c) => c.id === activeChatId);
  }, [conversations, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleChatClick = useCallback((convId: string) => {
    if (convId !== activeChatId) {
      setMessages([]);
      setNewMessage('');
      navigate(`/messaging/${convId}`);
    }
  }, [activeChatId, navigate]);

  // ✅ 0. MARK AS READ FUNCTION (NEW)
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!currentUser?.id || !conversationId) return;

    // 1. Update the database: Set is_read = TRUE for all messages sent to the current user in this chat
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", currentUser.id)
      .eq("sender_id", conversationId);
      // NOTE: Supabase Real-time should automatically trigger a list refresh via the listener below.
    
    // 2. Optimistically clear the unread count in the local state immediately
    setConversations(prev => {
        return prev.map(conv => {
            if (conv.id === conversationId) {
                return { ...conv, unreadCount: 0 };
            }
            return conv;
        });
    });
  }, [currentUser]);

  // ✅ 1. Load logged-in user (Unchanged)
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user);
    };
    fetchUser();
  }, []);

  // ✅ 2. Fetch/Update all conversations (Updated to use is_read)
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchAndSetConversations = async () => {
      setLoading(true);
      
      // 1. Fetch ALL messages (to group and find last message/time)
      const { data: allMessages, error } = await supabase
        .from("messages")
        .select("*, is_read") // Ensure you select the new is_read column
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading conversations:", error);
        setLoading(false);
        return;
      }

      // 2. Group messages, find last message, and count UNREAD messages
      const grouped = new Map<string, { lastMsg: any; unreadCount: number }>();
      const participantIds = new Set<string>();

      for (const msg of allMessages) {
        const otherId =
          msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;

        if (otherId === currentUser.id) continue;
        participantIds.add(otherId);

        if (!grouped.has(otherId)) {
          grouped.set(otherId, { lastMsg: msg, unreadCount: 0 });
        }
        
        // **NEW LOGIC: Count if sent TO me AND is_read is FALSE**
        if (msg.receiver_id === currentUser.id && msg.is_read === false) {
             const current = grouped.get(otherId)!;
             current.unreadCount += 1;
             grouped.set(otherId, current);
        }
      }

      // 3. Fetch profiles for all participants (Unchanged)
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, role, profile_image")
        .in("id", Array.from(participantIds));

      const profilesMap = new Map<string, Profile>();
      profilesData?.forEach((p) => profilesMap.set(p.id, p as Profile));

      // 4. Format and sort conversations (Unchanged)
      let formatted: Conversation[] = Array.from(grouped.entries()).map(
        ([userId, { lastMsg, unreadCount }]) => {
          const profile = profilesMap.get(userId);
          const lastMessageTime = new Date(lastMsg?.created_at);

          return {
            id: userId,
            name: profile?.full_name || "Unknown User",
            type: profile?.role || "User",
            profile_image: profile?.profile_image,
            lastMessage: lastMsg?.content || "",
            lastMessageTime: lastMessageTime,
            unreadCount: unreadCount,
          };
        }
      );

      formatted.sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      );

      setConversations(formatted);
      setLoading(false);
    };

    fetchAndSetConversations();
    
    // --- REAL-TIME LISTENER FOR CONVERSATION LIST & SORTING (UPDATED) ---
    // Listen for INSERT (new messages) and UPDATE (is_read status change) events
    const conversationChannel = supabase
        .channel("conversations_realtime")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "messages" }, // Listen to *ALL* events
            (payload) => {
                const msg = payload.new || payload.old; // Use new for INSERT/UPDATE, old for DELETE
                
                if (!msg || (msg.sender_id !== currentUser.id && msg.receiver_id !== currentUser.id)) return;
                
                // If it's an UPDATE on is_read, we need to re-fetch the conversation list 
                // to get the accurate new unread count from the database.
                // For simplicity, we trigger a full list reload on any INSERT or UPDATE event
                // that involves the current user, rather than complex local state calculation.
                fetchAndSetConversations(); 
            }
        )
        .subscribe();
    
    return () => {
        supabase.removeChannel(conversationChannel);
    };

  }, [currentUser]); // Removed activeChatId dependency to prevent excessive re-runs

  // ✅ 3. Fetch messages for active chat & Real-time (Includes Mark As Read)
  useEffect(() => {
    if (!activeChatId || !currentUser?.id) return;

    const loadMessages = async () => {
      // Fetch messages (unchanged)
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeChatId}),and(sender_id.eq.${activeChatId},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
      setTimeout(scrollToBottom, 50); 
    };

    loadMessages();
    
    // --- MARK MESSAGES AS READ WHEN CHAT IS OPENED ---
    markMessagesAsRead(activeChatId);
    // ---------------------------------------------------


    // Set up real-time listener for the chat pane (Unchanged)
    const channel = supabase
      .channel(`chat_${activeChatId}_${currentUser.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === currentUser.id &&
              msg.receiver_id === activeChatId) ||
            (msg.sender_id === activeChatId &&
              msg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => {
                const isOptimisticallyAdded = prev.some(
                    m => m.id === msg.id || (m.sender_id === msg.sender_id && m.content === msg.content)
                );
                return isOptimisticallyAdded ? prev : [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId, currentUser, markMessagesAsRead]); // Added markMessagesAsRead dependency

  // ✅ 4. Auto-scroll messages to bottom (Unchanged)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ 5. Send message function (Optimistic UI - UPDATED)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    const messageContent = newMessage;
    setNewMessage(""); 

    // Create message object
    const tempMessage = {
      id: Math.random().toString(), 
      sender_id: currentUser.id,
      receiver_id: activeChatId,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_read: true, // Sender's message is always read by the sender
    };
    const newLastMessageTime = new Date(tempMessage.created_at);

    // Optimistically update the Conversation List on send
    setConversations(prevConversations => {
        const existingConv = prevConversations.find(c => c.id === activeChatId);
        let updatedConversations = prevConversations.filter(c => c.id !== activeChatId);
        
        const updatedConv: Conversation = {
            id: activeChatId,
            name: existingConv?.name || activeChatId, 
            type: existingConv?.type || 'User',
            profile_image: existingConv?.profile_image || null,
            lastMessage: messageContent,
            lastMessageTime: newLastMessageTime,
            unreadCount: 0, // Sending a message means this chat is active/read
        };

        updatedConversations.push(updatedConv); 
        updatedConversations.sort(
            (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        );
        
        return updatedConversations;
    });

    // Optimistically add the message to the messages state
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 50);

    // Send to database
    await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: activeChatId,
        content: messageContent,
        is_read: false, // Default to false for the receiver
      },
    ]);
  };

  // Filtered conversations based on search term (Unchanged)
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    const lowercasedTerm = searchTerm.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(lowercasedTerm) ||
        conv.lastMessage.toLowerCase().includes(lowercasedTerm)
    );
  }, [conversations, searchTerm]);

  if (loading)
    return <div className="p-10 text-center">Loading messages...</div>;

  return (
    <div className="h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid lg:grid-cols-12 h-full">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 bg-white border-r border-neutral-200 flex flex-col lg:block">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-lg md:text-xl font-semibold text-neutral-900 mb-4">Messages</h2>
              <div className="relative">
                <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 sm:py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-neutral-500 text-center">
                  {searchTerm ? "No results found" : "No messages yet"}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleChatClick(conv.id)} 
                    className={`w-full p-4 sm:p-5 flex items-start gap-4 hover:bg-neutral-50 transition border-b border-neutral-100 ${
                      activeChatId === conv.id ? "bg-amber-50" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          conv.profile_image ||
                          "https://via.placeholder.com/48x48?text=User"
                        }
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`truncate ${
                            conv.unreadCount > 0
                              ? "font-semibold text-neutral-900"
                              : "text-neutral-900"
                          }`}
                        >
                          {conv.name}
                        </h3>
                        <span
                          className={`text-xs flex-shrink-0 ${
                            conv.unreadCount > 0
                              ? "text-amber-600 font-medium"
                              : "text-neutral-500"
                          }`}
                        >
                          {conv.lastMessageTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                          <p
                            className={`text-sm truncate ${
                              conv.unreadCount > 0
                                ? "text-neutral-800 font-medium"
                                : "text-neutral-600"
                            }`}
                          >
                            {conv.lastMessage}
                          </p>
                          {/* Unread Count Badge UI */}
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold leading-none text-white bg-amber-500 rounded-full flex-shrink-0">
                                {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                            </span>
                          )}
                      </div>
                      <span className="text-neutral-500 text-xs">
                        {conv.type}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT CHAT PANE (Unchanged) */}
          <div className="lg:col-span-8 bg-white flex flex-col w-full">
            {activeChatId ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between flex-col sm:flex-row">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        activeChat?.profile_image ||
                        "https://via.placeholder.com/48x48?text=User"
                      }
                      alt={activeChat?.name || "User"}
                      className="w-12 h-12 rounded-full object-cover bg-neutral-200"
                    />
                    <div>
                      <div className="text-neutral-900 font-medium">
                        {activeChat?.name || "Chat"}
                      </div>
                      <div className="text-neutral-600 text-sm">
                        {activeChat?.type || "Active now"}
                      </div>
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
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === currentUser.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                          msg.sender_id === currentUser.id
                            ? "bg-amber-500 text-white"
                            : "bg-neutral-100 text-neutral-900"
                        }`}
                      >
                        {msg.content}
                        <div className="text-right text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> {/* Scroll target */}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-end gap-3">
                  <button className="p-2 text-neutral-600 hover:bg-white rounded-lg transition">
                    <Smile className="w-5 h-5" />
                  </button>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-3 text-white rounded-xl transition ${
                      newMessage.trim()
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        : "bg-neutral-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}