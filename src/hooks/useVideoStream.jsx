import { useState, useEffect, useCallback, useRef } from 'react';
import { MEDIA_STREAM_ERROR_MESSAGES } from '../constants/errorMessages';
import { getVideoConstraints } from '../utils/mediaConstraintsUtils';

function useVideoStream() {
  const [videoStream, setVideoStream] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const videoStreamRef = useRef(null);

  // 비디오 스트림을 가져오는 함수
  const getVideoStream = useCallback(async (videoId) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVideoError(MEDIA_STREAM_ERROR_MESSAGES.BROWSER_NOT_SUPPORTED);
      return;
    }

    // 기존 스트림을 정리
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
      setVideoStream(null);
    }

    try {
      // deviceId가 있는 경우 constraints에 추가
      const constraints = getVideoConstraints(videoId);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoStreamRef.current = stream;
      setVideoStream(stream);
      setVideoError(null);
    } catch (error) {
      setVideoError(MEDIA_STREAM_ERROR_MESSAGES.STREAM_ERROR);
      setVideoStream(null);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getVideoStream();
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
      }
    };
  }, [getVideoStream]);

  return { videoStream, videoError, getVideoStream };
}

export default useVideoStream;
