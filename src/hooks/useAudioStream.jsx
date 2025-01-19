import { useState, useEffect, useCallback, useRef } from 'react';
import { MEDIA_STREAM_ERROR_MESSAGES } from '../constants/errorMessages'; // 에러 메시지 상수 가져오기
import { getAudioConstraints } from '../utils/mediaConstraintsUtils';

function useAudioStream() {
  const [audioStream, setAudioStream] = useState(null); // 스트림 상태를 관리하기 위한 state
  const [audioError, setAudioError] = useState(null); // 에러 상태를 관리하기 위한 state
  const audioStreamRef = useRef(null); // 현재 스트림을 참조하기 위한 ref

  // 미디어 스트림을 가져오는 함수
  const getAudioStream = useCallback(async (audioId) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioError(MEDIA_STREAM_ERROR_MESSAGES.BROWSER_NOT_SUPPORTED); //추후 여러 브라우저 호환성을 생각할 것 -> 호환 : Chrome, Edge, Firefox, Safari, Opera
      return;
    }

    // 기존에 존재하는 스트림이 있다면 모든 트랙을 정지하고 null로 설정
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
      setAudioStream(null);
    }

    try {
      // deviceId가 있는 경우 constraints에 추가
      const constraints = getAudioConstraints(audioId);
      // 새로 미디어 스트림을 요청
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;
      setAudioStream(stream);
      setAudioError(null);
    } catch (error) {
      setAudioError(MEDIA_STREAM_ERROR_MESSAGES.STREAM_ERROR);
      setAudioStream(null);
      console.log(error);
    }
  }, []);

  // 컴포넌트가 마운트될 때 미디어 스트림을 가져옴
  useEffect(() => {
    getAudioStream();

    return () => {
      // 컴포넌트가 언마운트될 때 스트림의 모든 트랙을 정지하고 ref를 초기화
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    };
  }, [getAudioStream]);

  return { audioStream, audioError, getAudioStream };
}

export default useAudioStream;
