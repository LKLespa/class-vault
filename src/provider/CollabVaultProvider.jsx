import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthProvider";
import { collectionMap } from "../constants";

const CollabVaultContext = createContext();

export const useCollabVault = () => useContext(CollabVaultContext);

export const CollabVaultProvider = ({ children, vaultId }) => {
  const { userData } = useAuth();
  const [vaultData, setVaultData] = useState(null);
  const [vaultMessages, setVaultMessages] = useState([]);
  const [vaultResources, setVaultResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = useMemo(() => vaultData?.ownerId === userData?.id, [vaultData, userData]);
  const isAdmin = useMemo(() => {
    return (
      isOwner ||
      (Array.isArray(vaultData?.admins) && vaultData.admins.includes(userData?.id))
    );
  }, [isOwner, vaultData, userData]);

  const vaultType = collectionMap.collabvaults;

  // 📡 Fetch vault data in real-time
  useEffect(() => {
    if (!vaultId) return;

    setLoading(true);
    const vaultRef = doc(db, collectionMap.collabvaults, vaultId);

    const unsub = onSnapshot(
      vaultRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setVaultData({ id: snapshot.id, ...snapshot.data() });
          setError(null);

          console.log("Snap Vault Data", snapshot.data())
        } else {
          setVaultData(null);
          setError("Vault not found.");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message ?? "Error loading vault.");
        setLoading(false);
      }
    );

    console.log("Vault Data", vaultData)

    return () => unsub();
  }, [vaultId]);

  // 🛠 Placeholder Methods
  const getResources = () => {};
  const getMessages = () => {};
  const getSubmissions = () => {};

  const makeAdmin = ({ userId }) => {};
  const sendRequestToJoin = ({ id }) => {};
  const acceptRequestToJoin = ({ id }) => {};

  const sendMessage = ({ message, id }) => {};
  const uploadFile = ({ file, path, details }) => {};
  const uploadResource = ({ document, info, type = "resource" }) => {};
  const uploadSubmission = ({ document, info, respondingToFile }) => {};
  const downloadResource = ({ path, type }) => {};
  const viewResource = ({ path, data }) => {};
  const sendReminder = ({ reminder }) => {};
  const sendFeedBack = ({ resourceID, message }) => {};

  const value = {
    vaultData,
    vaultMessages,
    vaultResources,
    isOwner,
    isAdmin,
    loading,
    error,
    vaultType,
    // Methods
    getResources,
    getMessages,
    getSubmissions,
    makeAdmin,
    sendRequestToJoin,
    acceptRequestToJoin,
    sendMessage,
    uploadFile,
    uploadResource,
    uploadSubmission,
    downloadResource,
    viewResource,
    sendReminder,
    sendFeedBack,
  };

  return (
    <CollabVaultContext.Provider value={value}>
      {children}
    </CollabVaultContext.Provider>
  );
};
