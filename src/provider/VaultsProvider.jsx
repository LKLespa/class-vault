import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { toaster } from "../components/ui/toaster";
import { useAuth } from "./AuthProvider";
import { collectionMap } from "../constants";

const VaultContext = createContext();
export const useVaults = () => useContext(VaultContext);

export const VaultsProvider = ({ children }) => {
  const { userData } = useAuth();
  const [collabvaults, setCollabVaults] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading by default
  const [error, setError] = useState(null);

  // ⏱ Realtime listener for vaults the user is a member of
  useEffect(() => {
    if (!userData?.id) return;

    setLoading(true);

    // TODO: Query by last used
    const q = query(
      collection(db, collectionMap.collabvaults),
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
        admins: [userData.id],
        joinRequests: [],
        dateCreated: serverTimestamp(),
      };

      await addDoc(collection(db, collectionMap.collabvaults), vaultData);

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

  const sentJoinRequest = async ({ vaultId, collectionName }) => {
    if (!collectionName) {
      toaster.create({
        title: "Invalid vault type!",
        type: "error",
      });
      return;
    }
    setLoading(true)
    try {
      const vaultRef = doc(db, collectionName, vaultId);
      await updateDoc(vaultRef, {
        joinRequests: arrayUnion(userData.id),
      })
    } catch (error) {
      console.error("Error sending join request:", error.message);
      toaster.create({
        title: "Failed to send join request",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false)
    }
  }

  const cancelJoinRequest = async ({ userId, vaultId, collectionName }) => {
    if (!collectionName) {
      toaster.create({
        title: "Invalid vault type!",
        type: "error",
      });
      return;
    }
    setLoading(true)
    try {
      const vaultRef = doc(db, collectionName, vaultId);
      await updateDoc(vaultRef, {
        joinRequests: arrayRemove(userId),
      })
    } catch (error) {
      console.error("Error cancelling request:", error.message);
      toaster.create({
        title: "Failed to cancel request",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false)
    }
  }

  const approveJoinRequest = async ({ userId, vaultId, collectionName }) => {

    console.log("Approving", userId, vaultId, collectionName);
    
    if (!collectionName) {
      toaster.create({
        title: "Invalid vault type!",
        type: "error",
      });
      return;
    }

    setLoading(true)
    try {
      const vaultRef = doc(db, collectionName, vaultId);
      await updateDoc(vaultRef, {
        joinRequests: arrayRemove(userId),
        members: arrayUnion(userId),
      })
    } catch (error) {
      console.error("Error Approving request:", error.message);
      toaster.create({
        title: "Failed to approve request",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <VaultContext.Provider
      value={{
        collabvaults,
        loading,
        error,
        createCollabVault,
        sentJoinRequest,
        cancelJoinRequest,
        approveJoinRequest,
      }}
    >
      {children}
    </VaultContext.Provider>
  )
}
