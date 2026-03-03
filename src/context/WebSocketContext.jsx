import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [status, setStatus] = useState('DISCONNECTED'); // DISCONNECTED, CONNECTING, CONNECTED, RECONNECTING
    const [lastMessage, setLastMessage] = useState(null);
    const ws = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const heartbeatInterval = useRef(null);
    const subscriptions = useRef(new Map());

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        setStatus('CONNECTING');
        // Using a public or provided WebSocket URL. 
        // Example: Alchemy Ethereum Mainnet WS
        const wsUrl = import.meta.env.VITE_WS_URL || 'wss://eth-mainnet.g.alchemy.com/v2/demo';

        try {
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('WebSocket Connected');
                setStatus('CONNECTED');
                reconnectAttempts.current = 0;
                startHeartbeat();

                // Re-subscribe to all active subscriptions
                subscriptions.current.forEach((sub, id) => {
                    ws.current.send(JSON.stringify(sub));
                });
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                // Handle various message types here or via a callback system
            };

            ws.current.onclose = () => {
                console.log('WebSocket Closed');
                setStatus('DISCONNECTED');
                stopHeartbeat();
                handleReconnect();
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
                ws.current.close();
            };
        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
            handleReconnect();
        }
    }, []);

    const handleReconnect = useCallback(() => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
            setStatus('RECONNECTING');
            reconnectAttempts.current += 1;
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            console.log(`Attempting reconnect in ${timeout}ms...`);
            setTimeout(connect, timeout);
        } else {
            console.error('Max reconnect attempts reached');
            setStatus('DISCONNECTED');
        }
    }, [connect]);

    const startHeartbeat = () => {
        stopHeartbeat();
        heartbeatInterval.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                // Send a ping or heartbeat message expected by the server
                ws.current.send(JSON.stringify({ type: 'HEARTBEAT', timestamp: Date.now() }));
            }
        }, 30000); // 30 seconds
    };

    const stopHeartbeat = () => {
        if (heartbeatInterval.current) {
            clearInterval(heartbeatInterval.current);
        }
    };

    const subscribe = useCallback((id, subscriptionData) => {
        subscriptions.current.set(id, subscriptionData);
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(subscriptionData));
        }
    }, []);

    const unsubscribe = useCallback((id) => {
        subscriptions.current.delete(id);
        // If the API supports explicit unsubscribe, send it here
    }, []);

    const sendMessage = useCallback((message) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not open. Message not sent:', message);
        }
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (ws.current) {
                ws.current.close();
            }
            stopHeartbeat();
        };
    }, [connect]);

    const value = {
        status,
        lastMessage,
        subscribe,
        unsubscribe,
        sendMessage
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
