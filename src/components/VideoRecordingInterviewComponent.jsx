import { VIDEO_STEP } from '../constants/videoStep';
import { Box } from '@mui/material';
import InitialComponent from './VideoRecordingInterview/InitialComponent';
import ReadyComponent from './VideoRecordingInterview/ReadyComponent';
import QuestionOrRecordingComponent from './VideoRecordingInterview/QuestionOrRecordingComponent';
import ReviewComponent from './VideoRecordingInterview/ReviewComponent';
import FinalReviewComponent from './VideoRecordingInterview/FinalReviewComponent';
import MainStpperComponent from './VideoRecordingInterview/MainStpperComponent';
import SubStpperComponent from './VideoRecordingInterview/SubStpperComponent';
import { useMemo, memo } from 'react';

// MainStpperComponent 부분만 최적화하기
const MemoizedMainStpperComponent = memo(MainStpperComponent, (prevProps, nextProps) => {
  // mainActiveStep이 바뀌지 않았다면 리렌더링하지 않음
  return prevProps.mainActiveStep === nextProps.mainActiveStep;
});

// MainStpperComponent 부분만 최적화하기
const MemoizedSubStpperComponent = memo(SubStpperComponent, (prevProps, nextProps) => {
  // currentInterviewItem이 바뀌지 않았다면 리렌더링하지 않음
  return prevProps.currentInterviewItem === nextProps.currentInterviewItem;
});

function VideoRecordingInterviewComponent({
  step,
  navigate,
  currentRecordingIndex,
  currentInterviewItem,
  interviewItemCount,
  estimatedInterviewTime,
  onDeviceTestPopup,
  isDeviceTestPopup,
  onCheckVideoDevice,
  onCheckAudioDevice,
  onClose,
  videoDevices,
  audioDevices,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  handleVideoDeviceChange,
  handleAudioDeviceChange,
  isVideoChecked,
  isAudioChecked,
  audioStream,
  videoStream,
  videoError,
  audioError,
  mainActiveStep,
  handleMainStepperClick,
  timer,
  videoElement,
  handleAnswerEndClick,
  recordedVideosList,
  handleNextClick,
  handleRetryClick,
  handleExitClick,
  handleDownloadVideo,
  handleVideoUpload,
  isUploading,
  videoUrls,
  isLoading,
  handleLoadVideo,
  handleSubStepperClick,
  userInterviews,
  handleStartClick,
}) {
  // 배경 색상 계산을 useMemo로 최적화
  const backgroundColor = useMemo(() => {
    if (step === VIDEO_STEP.INITIAL || step === VIDEO_STEP.FINAL_REVIEW) {
      return 'white';
    }
    if (step === VIDEO_STEP.READY) {
      return 'gray';
    }
    return 'black';
  }, [step]);
  return (
    <Box
      sx={{
        width: '100vw', // 화면 전체 너비
        height: '100vh', // 화면 전체 높이
        margin: '0 auto',
        position: 'absolute', // 뷰포트를 기준으로 고정
        top: 0,
        left: 0,
        backgroundColor: backgroundColor,
        overflowY: 'auto', // 세로 스크롤 가능
        transition: 'background-color 1s',
      }}
    >
      {step === VIDEO_STEP.INITIAL && (
        <InitialComponent
          navigate={navigate}
          interviewItemCount={interviewItemCount}
          estimatedInterviewTime={estimatedInterviewTime}
          onDeviceTestPopup={onDeviceTestPopup}
          isDeviceTestPopup={isDeviceTestPopup}
          onCheckVideoDevice={onCheckVideoDevice}
          onCheckAudioDevice={onCheckAudioDevice}
          onClose={onClose}
          videoDevices={videoDevices}
          audioDevices={audioDevices}
          selectedVideoDeviceId={selectedVideoDeviceId}
          selectedAudioDeviceId={selectedAudioDeviceId}
          videoStream={videoStream}
          videoError={videoError}
          audioStream={audioStream}
          audioError={audioError}
          handleVideoDeviceChange={handleVideoDeviceChange}
          handleAudioDeviceChange={handleAudioDeviceChange}
          isAudioChecked={isAudioChecked}
          isVideoChecked={isVideoChecked}
          userInterviews={userInterviews}
          handleStartClick={handleStartClick}
        />
      )}

      <MemoizedMainStpperComponent
        step={step}
        mainActiveStep={mainActiveStep}
        handleMainStepperClick={handleMainStepperClick}
      />

      {/* 배경 어두워지기 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transition: 'opacity 0.5s',
          zIndex: -1, // 배경이 콘텐츠 뒤에 위치하도록 설정
        }}
      />

      {step === VIDEO_STEP.READY && ( // 면접 준비화면
        <ReadyComponent timer={timer} userInterviews={userInterviews} />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 1200,
            backgroundColor: 'white',
          }}
        >
          {step === VIDEO_STEP.QUESTION || step === VIDEO_STEP.RECORDING ? (
            <QuestionOrRecordingComponent
              videoElement={videoElement}
              step={step}
              navigate={navigate}
              currentInterviewItem={currentInterviewItem}
              timer={timer}
              handleAnswerEndClick={handleAnswerEndClick}
            />
          ) : null}

          {step === VIDEO_STEP.REVIEW && (
            <ReviewComponent
              currentRecordingIndex={currentRecordingIndex}
              recordedVideosList={recordedVideosList}
              handleNextClick={handleNextClick}
              handleRetryClick={handleRetryClick}
              handleDownloadVideo={handleDownloadVideo}
              isUploading={isUploading}
              handleVideoUpload={handleVideoUpload}
            />
          )}
        </Box>
      </Box>

      {step === VIDEO_STEP.FINAL_REVIEW && (
        <FinalReviewComponent
          recordedVideosList={recordedVideosList}
          videoUrls={videoUrls}
          handleLoadVideo={handleLoadVideo}
          isLoading={isLoading}
          handleExitClick={handleExitClick}
        />
      )}

      <MemoizedSubStpperComponent
        step={step}
        currentInterviewItem={currentInterviewItem}
        interviewItemCount={interviewItemCount}
        handleSubStepperClick={handleSubStepperClick}
        recordedVideosList={recordedVideosList}
      />
    </Box>
  );
}

export default VideoRecordingInterviewComponent;
