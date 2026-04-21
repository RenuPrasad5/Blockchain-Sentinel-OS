import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from 'firebase/firestore';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setWatchlist([]);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', auth.currentUser.uid);
        
        // Listen to watchlist changes
        const unsubWatchlist = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setWatchlist(snapshot.data().watchlist || []);
            } else {
                // Initialize user document if it doesn't exist
                setDoc(userRef, { watchlist: [], alerts: [] }, { merge: true });
            }
            setLoading(false);
        });

        // Listen to alerts (separate collection for scalability)
        const alertsRef = doc(db, 'alerts', auth.currentUser.uid);
        const unsubAlerts = onSnapshot(alertsRef, (snapshot) => {
            if (snapshot.exists()) {
                setAlerts(snapshot.data().list || []);
            }
        });

        return () => {
            unsubWatchlist();
            unsubAlerts();
        };
    }, [auth.currentUser]);

    const addToWatchlist = async (address) => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            watchlist: arrayUnion(address.toLowerCase())
        });
    };

    const removeFromWatchlist = async (address) => {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            watchlist: arrayRemove(address.toLowerCase())
        });
    };

    const addAlert = async (alert) => {
        if (!auth.currentUser) return;
        const alertsRef = doc(db, 'alerts', auth.currentUser.uid);
        
        const docSnap = await getDoc(alertsRef);
        if (!docSnap.exists()) {
            await setDoc(alertsRef, { list: [alert] });
        } else {
            await updateDoc(alertsRef, {
                list: arrayUnion({
                    ...alert,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString()
                })
            });
        }
    };

    return (
        <WatchlistContext.Provider value={{ 
            watchlist, 
            alerts, 
            addToWatchlist, 
            removeFromWatchlist, 
            addAlert,
            loading 
        }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => useContext(WatchlistContext);
