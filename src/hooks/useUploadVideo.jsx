import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // firebaseConfig 파일을 import하세요

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);

  const getUploadVideo = async (file, fileName) => {
    setIsUploading(true);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // 업로드 진행률 계산 및 업데이트
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`업로드 진행률: ${progress}%`);
        },
        (error) => {
          console.error('비디오 업로드 실패:', error);
          setIsUploading(false);
          reject(error);
        },
        () => {
          // 업로드 완료 처리
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            resolve(downloadURL);
          });
        },
      );
    });
  };

  return { getUploadVideo, isUploading };
};

export default useUploadVideo;
