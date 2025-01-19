import { useState, useEffect, useCallback } from 'react';
import { DEVICE_ERROR_MESSAGES } from '../constants/errorMessages'; // 상수 가져오기

const useDeviceInfo = () => {
  const [videoDevices, setVideoDevices] = useState([]); // 비디오 장치 목록
  const [audioDevices, setAudioDevices] = useState([]); // 오디오 장치 목록
  const [hasVideoInput, setHasVideoInput] = useState(false); // 비디오 장치 목록
  const [hasAudioInput, setHasAudioInput] = useState(false); // 오디오 장치 목록
  const [deviceError, setDeviceError] = useState(null); // 에러 메시지 상태

  const getDevice = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices(); // 모든 장치 목록 가져오기
      const videoInputs = devices
        .filter((device) => device.kind === 'videoinput' && device.label) // 비디오 입력 장치 필터링 (레이블이 있는 것만)
        .map((device) => ({ id: device.deviceId, label: device.label }));

      const audioInputs = devices
        .filter((device) => device.kind === 'audioinput' && device.label) // 오디오 입력 장치 필터링 (레이블이 있는 것만)
        .map((device) => ({ id: device.deviceId, label: device.label }));

      setVideoDevices(videoInputs); // 비디오 장치 목록 설정
      setAudioDevices(audioInputs); // 오디오 장치 목록 설정
      setHasVideoInput(videoInputs.length > 0); // 비디오 장치가 있으면 true, 없으면 false 설정
      setHasAudioInput(audioInputs.length > 0); // 오디오 장치가 있으면 true, 없으면 false 설정
      // 장치 상태에 따른 에러 메시지 설정
      if (!videoInputs.length && !audioInputs.length) {
        setDeviceError(DEVICE_ERROR_MESSAGES.NO_DEVICES); // 비디오와 마이크 둘 다 없음
      } else if (!videoInputs.length) {
        setDeviceError(DEVICE_ERROR_MESSAGES.NO_VIDEO_INPUT); // 비디오만 없음
      } else if (!audioInputs.length) {
        setDeviceError(DEVICE_ERROR_MESSAGES.NO_AUDIO_INPUT); // 마이크만 없음
      } else {
        setDeviceError(null); // 모든 장치가 준비된 경우 에러 없음
      }
    } catch (error) {
      setDeviceError(DEVICE_ERROR_MESSAGES.DEVICE_CHECK_ERROR); // 장치 확인 중 오류 발생
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getDevice();

    // 장치 변경(추가나 제거) 시 devicechange 이벤트 핸들러 설정
    navigator.mediaDevices.addEventListener('devicechange', getDevice);

    // 클린업: ondevicechange 핸들러 제거
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevice);
    };
  }, [getDevice]);

  return { videoDevices, audioDevices, getDevice, deviceError, hasVideoInput, hasAudioInput };
};

export default useDeviceInfo;
