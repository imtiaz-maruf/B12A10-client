import React, { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

// 🔧 FIX: Explicitly request email scope
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveUserToDatabase = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: userData.uid,
                    email: userData.email,
                    displayName: userData.displayName || '',
                    photoURL: userData.photoURL || '',
                    provider: userData.provider || 'email',
                    createdAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to save user to database');
            }

            const data = await response.json();
            console.log('✅ User saved to database:', data);
            return data;
        } catch (error) {
            console.error('❌ Error saving user to database:', error);
        }
    };

    const registerUser = async (email, password, name, photoURL) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            if (name || photoURL) {
                await updateProfile(result.user, {
                    displayName: name || "",
                    photoURL: photoURL || "",
                });
                await result.user.reload();
            }

            await saveUserToDatabase({
                uid: result.user.uid,
                email: result.user.email,
                displayName: name || "",
                photoURL: photoURL || "",
                provider: 'email'
            });

            const refreshedUser = auth.currentUser;
            setUser(refreshedUser);

            return result;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // 🔧 POPUP VERSION: Request email explicitly
    const googleLogin = async () => {
        setLoading(true);
        try {
            // Force email selection and explicit consent
            googleProvider.setCustomParameters({
                prompt: 'consent',
                access_type: 'online'
            });

            const result = await signInWithPopup(auth, googleProvider);

            console.log('🔍 Google Login Result:', {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                uid: result.user.uid,
                providerData: result.user.providerData,
                metadata: result.user.metadata
            });

            // Check provider data for email
            const providerEmail = result.user.providerData[0]?.email;
            const finalEmail = result.user.email || providerEmail;

            if (!finalEmail) {
                console.error('⚠️ CRITICAL: No email in user OR providerData!');
                console.error('Full user object:', result.user);
                toast.error('Could not retrieve email from Google account. Please contact support.');
                throw new Error('No email received from Google');
            }

            console.log('✅ Email found:', finalEmail);

            await saveUserToDatabase({
                uid: result.user.uid,
                email: finalEmail,
                displayName: result.user.displayName || '',
                photoURL: result.user.photoURL || '',
                provider: 'google'
            });

            return result;
        } catch (error) {
            console.error("Google login error:", error);

            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Login cancelled');
            } else if (error.code === 'auth/popup-blocked') {
                toast.error('Popup blocked. Please allow popups for this site.');
            } else if (error.code !== 'auth/cancelled-popup-request') {
                toast.error('Google login failed: ' + (error.message || 'Unknown error'));
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("🔐 Auth State Changed:", {
                exists: !!currentUser,
                email: currentUser?.email,
                displayName: currentUser?.displayName,
                uid: currentUser?.uid,
                providerData: currentUser?.providerData
            });

            if (currentUser) {
                const providerEmail = currentUser.providerData[0]?.email;
                const finalEmail = currentUser.email || providerEmail;

                if (finalEmail) {
                    await saveUserToDatabase({
                        uid: currentUser.uid,
                        email: finalEmail,
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || '',
                        provider: currentUser.providerData[0]?.providerId || 'unknown'
                    });
                }
            }

            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        loginUser,
        googleLogin,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;