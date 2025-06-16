import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthProvider";
import { collectionMap } from "../constants";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL } from "firebase/storage";
import { uploadFile } from "../utils/firebase functions";
import { toaster } from "../components/ui/toaster";

const CollabVaultContext = createContext();

export const useCollabVault = () => useContext(CollabVaultContext);

export const CollabVaultProvider = ({ children, vaultId }) => {
  const { userData } = useAuth();
  const [vaultData, setVaultData] = useState(null);
  const [vaultMessages, setVaultMessages] = useState([]);
  const [vaultResources, setVaultResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
  const getResources = () => { };
  const getMessages = () => { };
  const getSubmissions = () => { };

  const makeAdmin = ({ userId }) => { };
  const sendRequestToJoin = ({ id }) => { };
  const acceptRequestToJoin = ({ id }) => { };

  const sendMessage = ({ message, id }) => { };

  const uploadResource = async ({
    file,
    message = "",
    type,
    otherData = {}
  }) => {
    console.log("Upload Resource", file, message, type, otherData)
    if (!file || !type) return null;

    setUploading(true);
    try {
      // Step 1: Upload file to storage
      const uploadedData = await uploadFile({
        file,
        vaultId,
        path: "resources",
      });

      console.log("Here");

      if (!uploadedData) throw new Error("File upload failed");

      // Step 2: Add document to Firestore
      const docRef = await addDoc(collection(db, vaultType, vaultId, "resources"), {
        name: uploadedData.name,
        url: uploadedData.url,
        fileSize: uploadedData.fileSize,
        extension: uploadedData.extension,
        type: uploadedData.type,
        message: message.trim(),
        timestamp: serverTimestamp(),
        senderId: userData.id,
        senderName: userData.fullName,
        ...otherData,
      });
      console.log("Now here");
      setUploading(false)
      toaster.create({title: "Uploaded Successful", type: 'success'})
      return {
        id: docRef.id,
        ...uploadedData,
        message: message.trim(),
        senderId: userData.id,
        senderName: userData.fullname,
      };
    } catch (err) {
      console.log("❌ Failed to upload resource:", err);
      toaster.create({title: "❌ Upload Failed:", type: 'error'})
      setUploading(false)
      return null;
    } finally {
      setUploading(false)
    }
  }


    const uploadSubmission = ({ document, info, respondingToFile }) => { };
    const downloadResource = ({ path, type }) => { };
    const viewResource = ({ path, data }) => { };
    const sendReminder = ({ reminder }) => { };
    const sendFeedBack = ({ resourceID, message }) => { };

    const value = {
      vaultData,
      vaultMessages,
      vaultResources,
      isOwner,
      isAdmin,
      loading,
      uploading,
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
