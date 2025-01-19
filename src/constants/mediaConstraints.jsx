// 비디오 출력시 미디어 스트림 제약 조건
export const VIDEO_CONSTRAINTS = Object.freeze({
  video: {
    frameRate: { ideal: 30 }, // width, height 선언 시, 카메라 깨짐 발생
  },
});

// 오디오 출력시 미디어 스트림 제약 조건
export const AUDIO_CONSTRAINTS = Object.freeze({
  audio: true,
});
