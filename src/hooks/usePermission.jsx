import { useState, useCallback, useEffect } from 'react';
import { PERMISSION_ERROR_MESSAGES } from '../constants/errorMessages'; // 에러 메시지 상수 가져오기

const usePermission = () => {
  const [permissions, setPermissions] = useState({ camera: null, microphone: null });
  const [permissionError, setPermissionError] = useState(null);

  // 권한 요청 함수 (단순 요청만 진행)
  const requestPermissions = useCallback(async () => {
    try {
      // 카메라와 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop()); // 요청 후 스트림 정지
    } catch (error) {
      setPermissionError(PERMISSION_ERROR_MESSAGES.DEVICE_NOT_FOUND); // 기기 문제로 권한 요청 실패 시 에러 설정
      console.error(error);
    }
  }, []);

  // 권한 상태 확인 함수
  const checkPermissions = useCallback(async () => {
    try {
      const camera = await navigator.permissions.query({ name: 'camera' });
      const microphone = await navigator.permissions.query({ name: 'microphone' });

      setPermissions({ camera: camera.state, microphone: microphone.state });

      // 권한 상태에 따른 에러 메시지 설정
      if (camera.state === 'denied' && microphone.state === 'denied') {
        setPermissionError(PERMISSION_ERROR_MESSAGES.DENIED_BOTH);
      } else if (camera.state === 'denied') {
        setPermissionError(PERMISSION_ERROR_MESSAGES.DENIED_CAMERA);
      } else if (microphone.state === 'denied') {
        setPermissionError(PERMISSION_ERROR_MESSAGES.DENIED_MICROPHONE);
      } else {
        setPermissionError(null); // 권한에 문제가 없으면 에러 메시지 초기화
      }
    } catch (error) {
      setPermissionError(PERMISSION_ERROR_MESSAGES.DEVICE_NOT_FOUND);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    requestPermissions(); // 권한 요청
    checkPermissions(); // 요청 후 권한 상태 확인

    // 카메라와 마이크 권한 상태 변경 시 권한 요청 및 상태 확인
    Promise.all([
      navigator.permissions.query({ name: 'camera' }),
      navigator.permissions.query({ name: 'microphone' }),
    ]).then(([cameraPermission, microphonePermission]) => {
      const handlePermissionChange = async () => {
        await requestPermissions(); // 권한 요청
        await checkPermissions(); // 요청 후 권한 상태 확인
        // 권한 재설정 클릭 시 권한 요청 창 출력을 위해 요청, 확인 진행
      };

      cameraPermission.onchange = handlePermissionChange;
      microphonePermission.onchange = handlePermissionChange;
    });

    // 클린업: 권한 상태 변경 리스너 제거
    return () => {
      Promise.all([
        navigator.permissions.query({ name: 'camera' }),
        navigator.permissions.query({ name: 'microphone' }),
      ]).then(([cameraPermission, microphonePermission]) => {
        cameraPermission.onchange = null;
        microphonePermission.onchange = null;
      });
    };
  }, [checkPermissions, requestPermissions]);
  return { permissions, permissionError, checkPermissions, requestPermissions };
};

export default usePermission;
