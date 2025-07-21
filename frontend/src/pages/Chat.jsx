import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const chatBox = {
    maxWidth: 500,
    margin: '2.5rem auto',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2rem 1.5rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    height: 600,
};
const messagesArea = {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 16,
    paddingRight: 8,
};
const messageBubble = (isMe) => ({
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    background: isMe ? '#1dbf73' : '#f5f5f5',
    color: isMe ? '#fff' : '#222',
    borderRadius: 16,
    padding: '0.7rem 1.2rem',
    margin: '0.3rem 0',
    maxWidth: '70%',
    fontSize: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});
const inputRow = {
    display: 'flex',
    gap: 8,
};
const inputStyle = {
    flex: 1,
    padding: '0.7rem',
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: '1rem',
};
const sendBtn = {
    background: '#1dbf73',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.7rem 1.5rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
};

const socket = io(process.env.REACT_APP_SERVER_URL, {
    transports: ['websocket'],
    withCredentials: true,
});

const Chat = () => {
    const { user, token } = useAuth();
    const { userId } = useParams(); // chatting with userId
    const location = useLocation();
    const gigIdFromState = location.state?.gigId;
    const gigTitleFromState = location.state?.gigTitle;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [order, setOrder] = useState(null);
    const messagesEndRef = useRef();
    const [gigBannerState, setGigBannerState] = useState(null);

    // Fetch other user's info
    useEffect(() => {
        if (!userId) return;
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/user/${userId}`)
            .then(res => res.json())
            .then(data => setOtherUser(data));
    }, [userId]);

    // Fetch latest order between users
    useEffect(() => {
        if (!user || !userId) return;
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Find the latest order between these two users
                    const relevant = data.filter(o =>
                        (o.buyerId._id === user.id && o.sellerId._id === userId) ||
                        (o.sellerId._id === user.id && o.buyerId._id === userId)
                    );
                    if (relevant.length > 0) {
                        // Sort by createdAt descending
                        relevant.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        setOrder(relevant[0]);
                    }
                }
            });
    }, [user, userId, token]);

    useEffect(() => {
        if (!user || !userId) return;
        socket.emit('join', user.id);
        // Fetch chat history
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/messages/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setMessages(Array.isArray(data) ? data : []);
                // Set gig banner to latest gig if present
                if (Array.isArray(data) && data.length > 0) {
                    const lastWithGig = [...data].reverse().find(m => m.gig && m.gig.title);
                    if (lastWithGig) setGigBannerState({ gigId: lastWithGig.gig._id || lastWithGig.gig, gigTitle: lastWithGig.gig.title });
                }
            });
        // Listen for incoming messages
        socket.on('chat:receive', (msg) => {
            if (msg.sender === userId) {
                setMessages((prev) => [...prev, { sender: userId, receiver: user.id, content: msg.content, timestamp: msg.timestamp, gig: msg.gig }]);
                // If gig info present, update gig banner
                if (msg.gig && msg.gig.title) {
                    setGigBannerState({ gigId: msg.gig._id || msg.gig, gigTitle: msg.gig.title });
                }
            }
        });
        return () => {
            socket.off('chat:receive');
        };
    }, [user, userId, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Prefer gigBannerState if set, else fallback to gigIdFromState or messages
    const gigBanner = gigBannerState
        || (gigIdFromState && gigTitleFromState ? { gigId: gigIdFromState, gigTitle: gigTitleFromState } : null)
        || (() => {
            const msgWithGig = messages.find(m => m.gig && m.gig.title);
            if (msgWithGig) return { gigId: msgWithGig.gig, gigTitle: msgWithGig.gig.title };
            return null;
        })();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        // Send to backend (save)
        const body = { receiver: userId, content: input };
        if (gigIdFromState) body.gig = gigIdFromState;
        await fetch(`${process.env.REACT_APP_SERVER_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        // Emit via socket
        socket.emit('chat:send', { sender: user.id, receiver: userId, content: input, gig: gigIdFromState ? { _id: gigIdFromState, title: gigTitleFromState } : undefined });
        setMessages((prev) => [...prev, { sender: user.id, receiver: userId, content: input, timestamp: new Date(), gig: gigIdFromState ? { _id: gigIdFromState, title: gigTitleFromState } : undefined }]);
        // Update gig banner for sender as well
        if (gigIdFromState && gigTitleFromState) {
            setGigBannerState({ gigId: gigIdFromState, gigTitle: gigTitleFromState });
        }
        setInput('');
    };

    // Determine roles
    let myRole = 'User', otherRole = 'User';
    if (order) {
        if (order.buyerId._id === user.id) {
            myRole = 'Buyer';
            otherRole = 'Seller';
        } else if (order.sellerId._id === user.id) {
            myRole = 'Seller';
            otherRole = 'Buyer';
        }
    }
    // If you want to dynamically determine roles, you can adjust this logic.

    return (
        <div style={chatBox}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>Chat</div>
            {gigBanner && (
                <div style={{ background: '#f5f5f5', color: '#1dbf73', fontWeight: 600, borderRadius: 8, padding: '0.6rem 1rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="gig">🛒</span> Gig: {gigBanner.gigTitle}
                </div>
            )}
            <div style={messagesArea}>
                {messages.map((msg, i) => {
                    const isMe = msg.sender === user.id;
                    const name = isMe ? (user.username || 'You') : (otherUser?.username || 'User');
                    const role = isMe ? myRole : otherRole;
                    return (
                        <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', width: '100%' }}>
                            <div style={{ ...messageBubble(isMe), alignItems: 'flex-start', textAlign: 'left' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.97rem', marginBottom: 2 }}>
                                    {name} <span style={{ color: '#888', fontWeight: 400, fontSize: '0.93rem' }}>({role})</span>
                                </div>
                                <div>{msg.content}</div>
                                <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
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
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button style={sendBtn} type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat; 