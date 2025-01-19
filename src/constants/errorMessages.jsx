// 미디어 스트림 관련 에러 메시지 객체
export const MEDIA_STREAM_ERROR_MESSAGES = Object.freeze({
  BROWSER_NOT_SUPPORTED: '해당 브라우저에서는 mediaDevices를 사용할 수 없습니다.',
  STREAM_ERROR: '미디어 스트림을 가져오는 중 오류가 발생했습니다.',
});

// 권한 설정 관련 에러 메시지 객체
export const PERMISSION_ERROR_MESSAGES = Object.freeze({
  DENIED_CAMERA: '카메라 권한이 거부되었습니다.',
  DENIED_MICROPHONE: '마이크 권한이 거부되었습니다',
  DENIED_BOTH: '카메라와 마이크 권한이 모두 거부되었습니다',
  PERMISSION_CHECK_ERROR: '권한 확인 중 오류 발생',
  DEVICE_NOT_FOUND: '문제가 발생했습니다. 장치가 연결되어 있는지, 권한이 허용되어있는지 확인해 주세요.',
});

// 디바이스 상태 관련 에러 메시지 객체
export const DEVICE_ERROR_MESSAGES = Object.freeze({
  NO_DEVICES: '연결된 비디오와 마이크 장치가 없습니다.',
  NO_VIDEO_INPUT: '연결된 카메라 장치가 없습니다.',
  NO_AUDIO_INPUT: '연결된 마이크 장치가 없습니다.',
  DEVICE_CHECK_ERROR: '장치 확인 중 오류 발생',
});
