import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from "firebase/auth";
import {
    doc,
    setDoc,
    onSnapshot,
    collection,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { toaster } from "../components/ui/toaster"
import { auth, db } from "../firebase"; // your firebase config file

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authInstance = getAuth();
    const isAuthenticated = !!authInstance.currentUser;

    useEffect(() => {
        setLoading(true)
        let unsubUser = null;

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                unsubUser = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData({ id: user.uid, ...docSnap.data() });
                    }
                });
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe(); // stop listening to auth changes
            if (unsubUser) unsubUser(); // stop listening to user doc changes
        };
    }, [authInstance]);

    const signUp = async ({
        email,
        password,
        fullName,
        phoneNumber,
        role,
        onDone,
    }) => {
        setLoading(true);
        setError(null);
        // console.log("Values", fullName, password, email, phoneNumber, role, onDone)

        const register = async () => {
            try {
                const { user } = await createUserWithEmailAndPassword(
                    authInstance,
                    email,
                    password
                );

                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    email,
                    fullName,
                    phoneNumber,
                    role,
                    dateCreated: serverTimestamp(),
                });

                setUserData({
                    id: user.uid,
                    email,
                    fullName,
                    phoneNumber,
                    role,
                });

                onDone && onDone();
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(register(), {
            success: {
                title: 'Successfully Registered!'
            },
            error: {
                title: "Registeration Failed!",
                description: "Something went wrong. Try again.",
            },
            loading: {
                title: "Registering...", description: "Please wait"
            }
        })
    };


    const signIn = async ({ email, password, onDone }) => {
        setLoading(true);
        setError(null);

        const login = async () => {
            try {
                const { user } = await signInWithEmailAndPassword(authInstance, email, password);
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserData({ id: user.uid, ...userDoc.data() });
                } else {
                    setUserData(null);
                }
                onDone && onDone();
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(login(), {
            success: {
                title: 'Successfully Logged In!'
            },
            error: {
                title: "Log In Failed!",
                description: error,
            },
            loading: {
                title: "Signing in...", description: "Please wait"
            }
        })
    };

    const signOut = async () => {
        setLoading(true);
        setError(null);

        const logOut = async () => {
            try {
                await firebaseSignOut(authInstance);
                setUserData(null);
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(logOut(), {
            success: {
                title: 'Successfully Logged Out!'
            },
            error: {
                title: "Log Out Failed!",
                description: "Something went wrong. Try again.",
            },
            loading: {
                title: "Logging out...", description: "Please wait"
            }
        })
    };

return (
    <AuthContext.Provider
        value={{
            userData,
            loading,
            error,
            isAuthenticated,
            signUp,
            signIn,
            signOut,
        }}
    >
        {children}
    </AuthContext.Provider>
);
};
