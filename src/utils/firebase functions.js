import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const uploadFile = async ({ file, vaultId }) => {
  if (!file || !vaultId) return null;

  return new Promise((resolve, reject) => {
    const fileId = uuidv4();
    const extension = file.name.split(".").pop();
    const fullPath = `vaults/${vaultId}/resources/${fileId}.${extension}`;

    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("❌ Upload failed:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            name: file.name,
            url: downloadURL,
            fileSize: file.size,
            extension,
            type: file.type,
            fullPath,
          });
        } catch (err) {
          console.error("❌ Failed to get download URL:", err);
          reject(err);
        }
      }
    );
  });
};

export { uploadFile }