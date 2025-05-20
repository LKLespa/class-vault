import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { toaster } from "../components/ui/toaster";
import { useAuth } from "./AuthProvider";

const VaultContext = createContext();
export const useVaults = () => useContext(VaultContext);

export const VaultsProvider = ({ children }) => {
  const { userData } = useAuth();
  const [collabVaults, setCollabVaults] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading by default
  const [error, setError] = useState(null);

  // ⏱ Realtime listener for vaults the user is a member of
  useEffect(() => {
    if (!userData?.id) return;

    setLoading(true);

    // TODO: Query by last used
    const q = query(
      collection(db, "collabVaults"),
      where("members", "array-contains", userData.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userVaults = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollabVaults(userVaults);
        setLoading(false);
      },
      (err) => {
        setError(err.message ?? "Error listening to vaults");
        setLoading(false);
      }
    );

    // 🚪 Clean up the listener on unmount
    return () => unsubscribe();
  }, [userData?.id]);

  // ➕ Create a new collab vault
  const createCollabVault = async ({ name, description, onDone }) => {
    if (!userData?.id) return;
    try {
      setLoading(true);
      setError(null);

      const vaultData = {
        name,
        description,
        ownerId: userData.id,
        members: [userData.id],
        admins: [],
        joinRequests: [],
        dateCreated: serverTimestamp(),
      };

      await addDoc(collection(db, "collabVaults"), vaultData);
      
      onDone && onDone();

      toaster.create({
        title: "Vault created successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      setError(err.message ?? "Error creating vault");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <VaultContext.Provider
      value={{
        collabVaults,
        loading,
        error,
        createCollabVault,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};
