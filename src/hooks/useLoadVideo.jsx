import { useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // firebaseConfig 파일을 import하세요

const useLoadVideo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getLoadVideo = async (fileName) => {
    try {
      setIsLoading(true); // 로딩 상태 활성화
      const videoRef = ref(storage, fileName);
      const url = await getDownloadURL(videoRef);
      return url;
    } catch (error) {
      console.error('비디오 불러오기 실패:', error);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  return { getLoadVideo, isLoading };
};

export default useLoadVideo;
