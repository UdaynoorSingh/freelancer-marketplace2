import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const primaryColor = "#6366f1";
const secondaryColor = "#8b5cf6";
const accentColor = "#06b6d4";
const successColor = "#10b981";
const warningColor = "#f59e0b";
const dangerColor = "#ef4444";
const darkColor = "#1e293b";
const lightColor = "#f8fafc";
const textPrimary = "#1e293b";
const textSecondary = "#64748b";
const borderColor = "#e2e8f0";

const chatBox = {
  maxWidth: 500,
  margin: "2.5rem auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
  border: "1px solid #eee",
  padding: "2rem 1.5rem 1.5rem 1.5rem",
  display: "flex",
  flexDirection: "column",
  height: 600,
};

const inboxStyle = {
  maxWidth: 800,
  margin: "2.5rem auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
  border: "1px solid #eee",
  padding: "2rem",
};

const conversationItem = {
  display: "flex",
  alignItems: "center",
  padding: "1rem",
  border: "1px solid #eee",
  borderRadius: 8,
  marginBottom: "0.5rem",
  cursor: "pointer",
  transition: "background 0.2s",
};

const conversationItemHover = {
  ...conversationItem,
  background: "#f8f9fa",
};

const messagesArea = {
  flex: 1,
  overflowY: "auto",
  marginBottom: 16,
  paddingRight: 8,
};
const messageBubble = (isMe) => ({
  alignSelf: isMe ? "flex-end" : "flex-start",
  background: isMe
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    : "#f5f5f5",
  color: isMe ? "#fff" : "#222",
  borderRadius: 16,
  padding: "0.7rem 1.2rem",
  margin: "0.3rem 0",
  maxWidth: "70%",
  fontSize: "1rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
});
const inputRow = {
  display: "flex",
  gap: 8,
};
const inputStyle = {
  flex: 1,
  padding: "0.7rem",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: "1rem",
};
const sendBtn = {
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0.7rem 1.5rem",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const socket = io(process.env.REACT_APP_SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("connect", () => {
  console.log("Connected to socket server");
});

const ChatInbox = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      console.log("Fetching conversations...");
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/messages/conversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch conversations: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Conversations data:", data);
      setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(`Failed to load conversations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (otherUserId, otherUsername) => {
    navigate(`/chat/${otherUserId}`);
  };

  return (
    <div style={inboxStyle}>
      <h2 style={{ color: "#1dbf73", fontWeight: 700, marginBottom: 24 }}>
        Messages
      </h2>

      {loading && <p>Loading conversations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div>
          {conversations.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center" }}>
              No conversations yet. Start chatting by viewing a gig and clicking
              "Contact Seller" or "Contact Buyer".
            </p>
          ) : (
            conversations
              .filter(
                (conv) =>
                  conv.otherUser &&
                  conv.otherUser._id &&
                  conv.otherUser.username
              )
              .map((conv, index) => (
                <div
                  key={conv.otherUser._id || index}
                  style={conversationItem}
                  onMouseOver={(e) => (e.target.style.background = "#f8f9fa")}
                  onMouseOut={(e) =>
                    (e.target.style.background = "transparent")
                  }
                  onClick={() =>
                    handleConversationClick(
                      conv.otherUser._id,
                      conv.otherUser.username
                    )
                  }
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#1dbf73",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      marginRight: "1rem",
                    }}
                  >
                    {conv.otherUser?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", color: "#222" }}>
                      {conv.otherUser?.username || "Unknown User"}
                    </div>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {conv.lastMessage?.content || "No messages yet"}
                    </div>
                    {conv.lastMessage && (
                      <div
                        style={{
                          color: "#888",
                          fontSize: "0.8rem",
                          marginTop: "0.2rem",
                        }}
                      >
                        {new Date(conv.lastMessage.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div
                      style={{
                        background: "#e53e3e",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const { user, token } = useAuth();
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const gigIdFromState = location.state?.gigId;
  const gigTitleFromState = location.state?.gigTitle;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef();
  const [gigBannerState, setGigBannerState] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setOtherUser(data))
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load user information");
      });
  }, [userId]);

  useEffect(() => {
    if (!user || !userId) return;
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const relevant = data.filter(
            (o) =>
              (o.buyerId &&
                o.buyerId._id === user.id &&
                o.sellerId &&
                o.sellerId._id === userId) ||
              (o.sellerId &&
                o.sellerId._id === user.id &&
                o.buyerId &&
                o.buyerId._id === userId)
          );
          if (relevant.length > 0) {
            relevant.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrder(relevant[0]);
          }
        }
      });
  }, [user, userId, token]);

  useEffect(() => {
    if (!user || !userId) return;

    setLoading(true);
    setError("");

    socket.emit("join", user.id);

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      })
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          const lastWithGig = [...data]
            .reverse()
            .find((m) => m.gig && m.gig.title);
          if (lastWithGig)
            setGigBannerState({
              gigId: lastWithGig.gig._id || lastWithGig.gig,
              gigTitle: lastWithGig.gig.title,
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setLoading(false);
      });

    socket.on("chat:receive", (msg) => {
      if (msg.sender === userId) {
        setMessages((prev) => [
          ...prev,
          {
            sender: userId,
            receiver: user.id,
            content: msg.content,
            timestamp: msg.timestamp,
            gig: msg.gig,
          },
        ]);
        if (msg.gig && msg.gig.title) {
          setGigBannerState({
            gigId: msg.gig._id || msg.gig,
            gigTitle: msg.gig.title,
          });
        }
      }
    });

    return () => {
      socket.off("chat:receive");
    };
  }, [user, userId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userId) {
    return <ChatInbox />;
  }

  const gigBanner =
    gigBannerState ||
    (gigIdFromState && gigTitleFromState
      ? { gigId: gigIdFromState, gigTitle: gigTitleFromState }
      : null) ||
    (() => {
      const msgWithGig = messages.find((m) => m.gig && m.gig.title);
      if (msgWithGig)
        return { gigId: msgWithGig.gig, gigTitle: msgWithGig.gig.title };
      return null;
    })();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const body = { receiver: userId, content: input };
      if (gigIdFromState) body.gig = gigIdFromState;

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      socket.emit("chat:send", {
        sender: user.id,
        receiver: userId,
        content: input,
        gig: gigIdFromState
          ? { _id: gigIdFromState, title: gigTitleFromState }
          : undefined,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: user.id,
          receiver: userId,
          content: input,
          timestamp: new Date(),
          gig: gigIdFromState
            ? { _id: gigIdFromState, title: gigTitleFromState }
            : undefined,
        },
      ]);

      if (gigIdFromState && gigTitleFromState) {
        setGigBannerState({
          gigId: gigIdFromState,
          gigTitle: gigTitleFromState,
        });
      }

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  let myRole = "User",
    otherRole = "User";
  if (order && order.buyerId && order.sellerId) {
    if (order.buyerId._id === user.id) {
      myRole = "Buyer";
      otherRole = "Seller";
    } else if (order.sellerId._id === user.id) {
      myRole = "Seller";
      otherRole = "Buyer";
    }
  }

  return (
    <div style={chatBox}>
      <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 12 }}>
        Chat
      </div>
      {gigBanner && (
        <div
          style={{
            background: "#f5f5f5",
            color: "#1dbf73",
            fontWeight: 600,
            borderRadius: 8,
            padding: "0.6rem 1rem",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span role="img" aria-label="gig">
            🛒
          </span>{" "}
          Gig: {gigBanner.gigTitle}
        </div>
      )}
      <div style={messagesArea}>
        {loading && <p>Loading messages...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading &&
          !error &&
          messages.map((msg, i) => {
            const isMe = msg.sender === user.id;
            const name = isMe
              ? user.username || "You"
              : otherUser?.username || "User";
            const role = isMe ? myRole : otherRole;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    ...messageBubble(isMe),
                    alignItems: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.97rem",
                      marginBottom: 2,
                    }}
                  >
                    {name}{" "}
                    <span
                      style={{
                        color: "#888",
                        fontWeight: 400,
                        fontSize: "0.93rem",
                      }}
                    >
                      ({role})
                    </span>
                  </div>
                  <div>{msg.content}</div>
                  <div
                    style={{ fontSize: "0.85rem", color: "#888", marginTop: 4 }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      <form style={inputRow} onSubmit={handleSend}>
        <input
          style={inputStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={sendBtn} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
