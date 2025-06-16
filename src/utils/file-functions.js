import { AiFillFile, AiFillFileImage, AiFillFilePdf, AiFillFileText } from "react-icons/ai";

export const getFileIcon = (extension) => {
  switch (extension) {
    case 'pdf':
      return AiFillFilePdf;
    case 'doc':
    case 'docx':
    case 'txt':
      return AiFillFileText;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return AiFillFileImage;
    default:
      return AiFillFile;
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp?.toDate) return "";

  const date = timestamp.toDate();

  const options = {
    weekday: "short",   // Tue
    day: "2-digit",     // 16
    hour: "numeric",    // 12
    minute: "2-digit",  // 14
    hour12: true        // pm
  };

  return date.toLocaleString("en-US", options); 
}