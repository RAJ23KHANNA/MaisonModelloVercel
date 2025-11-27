import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Send } from "lucide-react";

export function MessagingActual() {
  const { id: receiverId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Load user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user);
    };
    fetchUser();
  }, []);

  // ✅ Fetch old messages + subscribe to new ones
  useEffect(() => {
    if (!receiverId || !currentUser?.id) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
    };

    loadMessages();

    // Realtime listener
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const message = payload.new;
          if (
            (message.sender_id === currentUser.id &&
              message.receiver_id === receiverId) ||
            (message.sender_id === receiverId &&
              message.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiverId, currentUser]);

  // ✅ Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: newMessage,
      },
    ]);
    setNewMessage("");
  };

  if (!currentUser) return <div className="p-10 text-center">Loading chat...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-neutral-50">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender_id === currentUser.id
                  ? "bg-amber-500 text-white"
                  : "bg-white text-neutral-800 border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* Input box */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
