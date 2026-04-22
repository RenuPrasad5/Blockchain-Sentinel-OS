import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fallback: If Firebase takes too long, stop loading anyway
        const timeout = setTimeout(() => {
            if (loading) setLoading(false);
        }, 3000);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            try {
                if (currentUser) {
                    // Fetch additional user data from Firestore
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } else {
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
            } finally {
                setLoading(false);
                clearTimeout(timeout);
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const signup = async (email, password, profileData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Send verification email
        const actionCodeSettings = {
            url: `${import.meta.env.VITE_BASE_URL || 'http://localhost:5173'}/login`,
            handleCodeInApp: true,
        };
        await sendEmailVerification(userCredential.user, actionCodeSettings);

        // Save profile data to Firestore
        await setDoc(doc(db, "users", userId), {
            uid: userId,
            email,
            ...profileData,
            createdAt: new Date().toISOString()
        });

        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        userData,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0D1117',
                    color: '#6366f1',
                    fontFamily: 'sans-serif'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Blockchain Intelligence</div>
                        <div style={{ fontSize: '14px', opacity: 0.7 }}>Initializing Intelligence Interface...</div>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

