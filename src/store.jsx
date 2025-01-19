import { create } from 'zustand'; // default import로 create 함수 가져오기
import { useShallow } from 'zustand/react/shallow';
import { VIDEO_STEP } from './constants/videoStep';

export const useStore = create((set) => ({
  step: VIDEO_STEP.INITIAL,
  currentRecordingIndex: null,
  isDeviceTestPopup: false,
  videoStream: null,
  audioStream: null,
  isVideoChecked: false,
  isAudioChecked: false,
  videoUrls: [],
  isUploading: false,
  timer: null,
  recordedVideosList: [],
  mediaStream: null,

  setStep: (step) => set({ step }),
  setCurrentRecordingIndex: (index) => set({ currentRecordingIndex: index }),
  setIsDeviceTestPopup: () => set((state) => ({ isDeviceTestPopup: !state.isDeviceTestPopup })),
  setVideoStream: (stream) => set({ videoStream: stream }),
  setAudioStream: (stream) => set({ audioStream: stream }),
  setIsVideoChecked: (isChecked) => set({ isVideoChecked: isChecked }),
  setIsAudioChecked: (isChecked) => set({ isAudioChecked: isChecked }),
  addVideoUrl: (url) => set((state) => ({ videoUrls: [...state.videoUrls, url] })),
  setIsUploading: (isUploading) => set({ isUploading }),
  setTimer: (timer) => set({ timer }),
  setRecordedVideosList: (videos) => set({ recordedVideosList: videos }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
}));
