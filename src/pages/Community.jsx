import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Users,
    TrendingUp,
    ChevronUp,
    MessageCircle,
    Plus,
    ArrowLeft,
    Shield,
    Activity,
    BarChart3,
    Share2,
    MoreHorizontal,
    Search,
    Clock
} from 'lucide-react';
import { db } from '../firebase/config';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    increment
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import './StrategicDiscussion.css';

const IntelCard = ({ post }) => {
    const handleLike = async () => {
        try {
            const postRef = doc(db, 'discussionHub', post.id);
            await updateDoc(postRef, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    return (
        <div className="intel-card">
            <div className="card-sidebar">
                <div className="vote-box">
                    <button className="action-btn-mini" onClick={handleLike}>
                        <ChevronUp size={20} />
                    </button>
                    <span className="vote-count">{post.likes || 0}</span>
                </div>
            </div>
            <div className="card-main">
                <div className="card-header">
                    <div className="user-info">
                        <div className="user-node">{post.userName?.[0]?.toUpperCase() || '?'}</div>
                        <div className="user-meta">
                            <span className="username">{post.userName}</span>
                            <span className="tier-badge">Institutional Analyst</span>
                        </div>
                    </div>
                    <div className="timestamp">
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </div>
                </div>
                <div className="card-content">
                    {post.content}
                </div>
                <div className="card-footer">
                    <div className="metric">
                        <MessageCircle size={16} />
                        <span>{post.repliesCount || 0} Discussions</span>
                    </div>
                    <div className="metric">
                        <Activity size={16} />
                        <span>Risk Score: Low</span>
                    </div>
                    <div className="metric">
                        <Share2 size={16} />
                        <span>Share</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StrategicDiscussionHub = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Initializing Intelligence Stream (onSnapshot)...");
        const q = query(collection(db, 'discussionHub'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot received! Records count:", snapshot.size);
            const feedData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(feedData);
            setLoading(false);
        }, (error) => {
            console.error("CRITICAL: Stream Correlation Failure:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handlePostSubmit(e);
        }
    };

    const handlePostSubmit = async (e) => {
        if (e) e.preventDefault();
        console.log("Post submission triggered. User:", user?.uid, "Message:", newPost);

        if (!user) {
            alert("You must be logged in to post intelligence insights.");
            return;
        }

        if (!newPost.trim()) {
            console.log("Empty post content. Aborting.");
            return;
        }

        setIsPosting(true);
        try {
            const postData = {
                content: newPost.trim(),
                userId: user.uid,
                userName: userData?.fullName || user.displayName || user.email?.split('@')[0] || 'Anonymous Analyst',
                createdAt: serverTimestamp(),
                likes: 0,
                repliesCount: 0
            };

            console.log("Attempting to write to Firestore collection 'discussionHub'...", postData);

            const docRef = await addDoc(collection(db, 'discussionHub'), postData);

            console.log("Firestore write successful! Document ID:", docRef.id);
            setNewPost('');
            // Toast or visual confirmation could be added here
        } catch (error) {
            console.error("CRITICAL: Firestore Dispatch Error:", error);
            alert("Security Correlation Error: Could not dispatch intelligence to the network. " + error.message);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="strategic-hub fade-in">
            <div className="hub-container">
                {/* 70% MAIN CONTENT */}
                <div className="hub-main-content">
                    <div className="hub-header">
                        <div className="hub-title-group">
                            <span className="hub-badge">Intelligence Network</span>
                            <h1 className="hub-title">Strategic Discussion Hub</h1>
                        </div>
                    </div>

                    {/* Input Panel */}
                    <div className="intelligence-input-panel">
                        <div className="input-header" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="user-node">{user?.email?.[0]?.toUpperCase() || 'A'}</div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Post Professional Commentary</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: user ? '#10b981' : '#ef4444',
                                    boxShadow: user ? '0 0 10px #10b981' : 'none'
                                }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {user ? 'Analyst Connected' : 'Terminal Offline'}
                                </span>
                            </div>
                        </div>
                        <textarea
                            className="thought-terminal"
                            placeholder="Provide on-chain insights, risk analysis, or protocol observations..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="input-footer">
                            <div className="post-actions">
                                <button className="action-btn-mini" title="Attach Data"><Activity size={16} /></button>
                                <button className="action-btn-mini" title="Risk Level"><Shield size={16} /></button>
                                <button className="action-btn-mini" title="Analysis"><BarChart3 size={16} /></button>
                            </div>
                            <button
                                className="dispatch-btn"
                                onClick={handlePostSubmit}
                                disabled={isPosting || !newPost.trim()}
                            >
                                {isPosting ? 'Dispatching...' : 'Dispatch Insight'}
                            </button>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="discussion-feed">
                        {loading ? (
                            <div style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>Synchronizing with Intelligence Stream...</div>
                        ) : posts.length > 0 ? (
                            posts.map(post => <IntelCard key={post.id} post={post} />)
                        ) : (
                            <div style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>No strategic insights found. Be the first to analyze.</div>
                        )}
                    </div>
                </div>

                {/* 30% SIDEBAR ANALYTICS */}
                <aside className="hub-sidebar">
                    <div className="analytics-panel">
                        <div className="panel-section">
                            <div className="section-title">
                                <TrendingUp size={16} />
                                Trending Intelligence
                            </div>
                            <div className="hot-topic-list">
                                {[
                                    { tag: "#Layer2Scaling", count: "1.2k" },
                                    { tag: "#ZKProofs", count: "850" },
                                    { tag: "#LiquidStaking", count: "640" },
                                    { tag: "#MEV-Analysis", count: "420" }
                                ].map((topic, i) => (
                                    <div key={i} className="hot-topic-item">
                                        <span className="topic-label">{topic.tag}</span>
                                        <span className="topic-stats">{topic.count} hits</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel-section">
                            <div className="section-title">
                                <Activity size={16} />
                                Top Intelligence Officers
                            </div>
                            <div className="analyst-ranking">
                                {[
                                    { name: "Satoshi_Vision", field: "Cryptography", score: "99" },
                                    { name: "Protocol_Nerd", field: "L2 Research", score: "94" },
                                    { name: "DeFi_Wizard", field: "Risk Modeling", score: "88" }
                                ].map((officer, i) => (
                                    <div key={i} className="analyst-item">
                                        <div className="analyst-avatar" style={{ border: '1px solid #6366f1' }}>{officer.name[0]}</div>
                                        <div className="analyst-data">
                                            <div className="analyst-name">{officer.name}</div>
                                            <div className="analyst-metric">{officer.field}</div>
                                        </div>
                                        <div className="analyst-score">{officer.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                            <div className="section-title">
                                <Users size={16} />
                                Network Status
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Active Analysts</span>
                                    <span style={{ color: '#10b981' }}>4,129</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Intelligence Stream</span>
                                    <span style={{ color: '#10b981' }}>Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StrategicDiscussionHub;

