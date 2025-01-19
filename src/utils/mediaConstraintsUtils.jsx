import { VIDEO_CONSTRAINTS, AUDIO_CONSTRAINTS } from '../constants/mediaConstraints';

// 비디오 제약 조건에 videoId를 추가하는 함수
export const getVideoConstraints = (videoId, customConstraints) => ({
  ...(customConstraints || VIDEO_CONSTRAINTS),
  video: {
    ...(customConstraints?.video || VIDEO_CONSTRAINTS.video),
    ...(videoId ? { deviceId: { exact: videoId } } : {}),
  },
});

// 오디오 제약 조건에 audioId를 추가하는 함수
export const getAudioConstraints = (audioId) => ({
  ...AUDIO_CONSTRAINTS,
  audio: {
    ...AUDIO_CONSTRAINTS.audio,
    ...(audioId ? { deviceId: { exact: audioId } } : {}),
  },
});
