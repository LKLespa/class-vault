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