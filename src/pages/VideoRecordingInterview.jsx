import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder';
import useVideoStream from '../hooks/useVideoStream';
import useAudioStream from '../hooks/useAudioStream';
import useDeviceInfo from '../hooks/useDeviceInfo';
import usePermission from '../hooks/usePermission';
import useUploadVideo from '../hooks/useUploadVideo';
import useLoadVideo from '../hooks/useLoadVideo';
import { VIDEO_STEP } from '../constants/videoStep';
import mockData from '../Mock.json';
import VideoRecordingInterviewComponent from '../components/VideoRecordingInterviewComponent';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useStore } from '../store';
const auth = getAuth();

const VideoRecordingInterview = () => {
  // const { step, setStep, isDeviceTestPopup, setIsDeviceTestPopup, mediaStream, setMediaStream } = useStore();

  /*VideoRecordingInterview에서 사용하는 내부 변수들*/
  const [step, setStep] = useState(VIDEO_STEP.INITIAL); // 진행 단계
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState(null); // 현재 녹화 인덱스
  const [timer, setTimer] = useState(null); // 타이머 상태
  const [recordedVideosList, setRecordedVideosList] = useState([]); // 녹화된 비디오 리스트
  const videoElement = useRef(null); // video DOM 요소 상태
  const [isStart, setIsStart] = useState(false);

  /* Mock파일에서 추출한 변수 */
  const interviewItemCount = mockData.interviewItems.length; // 총 녹화 질문 개수
  const currentInterviewItem = mockData.interviewItems[currentRecordingIndex]; // 현재 녹화 중인 질문 아이템 정보를 변수로 할당
  const userInterviews = mockData.userInterviews[0];
  const estimatedInterviewTime = useMemo(() => {
    // 전체 예상 면접 시간 계산
    let totalTime = 0;
    for (let i = 0; i < interviewItemCount; i++) {
      const item = mockData.interviewItems[i];
      totalTime += (item.AnswerSeconds || 0) + (item.ReadingSeconds || 0);
    }
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    return `${minutes}분 ${seconds}초`;
  }, [interviewItemCount]);

  /*커스텀훅*/
  const { videoDevices, audioDevices, deviceError, getDevice, hasVideoInput, hasAudioInput } = useDeviceInfo(); // 커스텀 훅을 통해 장치와 관련된 상태 가져오기
  const { permissions, permissionError, requestPermissions, checkPermissions } = usePermission();
  const { videoStream, videoError, getVideoStream } = useVideoStream();
  const { audioStream, audioError, getAudioStream } = useAudioStream();
  const { getUploadVideo, isUploading } = useUploadVideo();
  const { getLoadVideo, isLoading } = useLoadVideo();

  // 경로 이동
  const navigate = useNavigate();

  const [mediaStream, setMediaStream] = useState(null); // 비디오, 오디오 통합 스트림
  const { startRecording, stopRecording } = useMediaRecorder({
    mediaStream,
  });

  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null); // 선택된 비디오 장치 ID
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null); // 선택된 오디오 장치 ID
  const handleVideoDeviceChange = (event) => {
    setSelectedVideoDeviceId(event.target.value); // 선택된 비디오 장치 ID 설정
  };
  const handleAudioDeviceChange = (event) => {
    setSelectedAudioDeviceId(event.target.value); // 선택된 오디오 장치 ID 설정
  };

  // 에러 조건 처리
  const isError =
    permissionError ||
    videoError ||
    audioError ||
    permissions.microphone !== 'granted' ||
    permissions.camera !== 'granted' ||
    deviceError;

  // 팝업과 관련된 변수들
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [isDeviceTestPopup, setIsDeviceTestPopup] = useState(false);

  // 비디오 업로드, 불러오기 관련 필요 변수
  const [videoUrls, setVideoUrls] = useState([]);

  // 메인 Stepper의 activeStep 계산
  const mainActiveStep = (() => {
    if (step === VIDEO_STEP.INITIAL) return null;
    if (step === VIDEO_STEP.READY) return 0;
    if (step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.REVIEW) return 1;
    if (step === VIDEO_STEP.FINAL_REVIEW) return 2;
    return 0; // 기본값
  })();

  // 팝업 생성 이벤트
  const onDeviceTestPopup = () => {
    setIsDeviceTestPopup(true);
  };
  // 팝업창의 비디오 체크 이벤트
  const onCheckVideoDevice = () => {
    setIsVideoChecked((prevState) => !prevState);
  };

  // 팝업창의 오디오 체크 이벤트
  const onCheckAudioDevice = () => {
    setIsAudioChecked((prevState) => !prevState);
  };

  // 팝업창 종료 이벤트
  const onClose = () => {
    setIsDeviceTestPopup(false);
  };

  // 비디오 로컬 저장 함수
  const downloadRecordedVideo = (blob, questionIndex) => {
    const videoUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video_${questionIndex + 1}.mp4`; // 파일 이름 설정
    a.click();
    URL.revokeObjectURL(videoUrl); // 메모리 해제
  };

  // 현재 녹화된 비디오를 로컬에 저장하는 함수
  const handleDownloadVideo = (questionIndex) => {
    const currentVideo = recordedVideosList.find((video) => video.questionIndex === questionIndex);
    if (currentVideo) {
      downloadRecordedVideo(currentVideo.blob, questionIndex);
    }
  };

  const handleStopRecording = useCallback(async () => {
    stopRecording().then((blob) => {
      const videoUrl = URL.createObjectURL(blob);

      setRecordedVideosList((prev) => {
        // 기존 리스트에서 blob이 없는 항목 확인 및 빈 blob으로 대체
        const updatedList = prev.map((item) => (!item.blob ? { ...item, blob: new Blob() } : item));

        // 새로 저장된 비디오 추가
        return [...updatedList, { videoUrl, blob, questionIndex: currentRecordingIndex }];
      });
    });
  }, [stopRecording, currentRecordingIndex]);

  // 면접녹화 시작 버튼 클릭
  const handleStartClick = () => {
    setIsStart(true); // 시작 상태 변경
  };

  // 다음 버튼 클릭
  const handleNextClick = () => {
    setCurrentRecordingIndex((prevIndex) => prevIndex + 1); // 녹화 인덱스 증가
  };

  // 답변 종료 버튼 클릭
  const handleAnswerEndClick = () => {
    const currentAnswerSecond = currentInterviewItem.AnswerSeconds - timer; // 답변한 시간
    if (currentAnswerSecond > currentInterviewItem.MinimumAnswerSeconds) {
      handleStopRecording();
      setStep(VIDEO_STEP.REVIEW);
    } else {
      console.log('최소 답변시간을 넘지 않았습니다. 답변시간 : ', currentAnswerSecond);
    }
  };

  // 재시도 버튼 클릭 시 호출되는 함수
  const handleRetryClick = () => {
    setStep(VIDEO_STEP.QUESTION); // 다시 질문 확인 화면부터 시작
    if (currentInterviewItem) {
      setTimer(currentInterviewItem.ReadingSeconds); // 타이머 설정
    }
    setRecordedVideosList((prev) => prev.slice(0, -1)); // 마지막으로 저장된 비디오 삭제
  };

  // 종료 버튼 클릭
  const handleExitClick = () => {
    setStep(VIDEO_STEP.INITIAL); // 초기 상태로 되돌림
  };

  // 메인 Stpper 클릭 시, 이동 로직
  const handleMainStepperClick = (index) => {
    if (index === 0) {
      // '면접 녹화 준비' 클릭 시
      setRecordedVideosList([]); // 모든 녹화 비디오 초기화
      setCurrentRecordingIndex(null); // 녹화 인덱스 초기화
      setStep(VIDEO_STEP.READY);
      setTimer(null); // 타이머 초기화
    } else if (index === 1) {
      // '면접 진행' 클릭 시
      if (interviewItemCount > 0) {
        // 0부터 interviewItemCount - 1까지의 인덱스를 순회하며 존재하지 않는 가장 낮은 인덱스를 찾음
        const recordedIndices = recordedVideosList.map((video) => video.questionIndex);
        let nextIndex = 0;

        for (let i = 0; i < interviewItemCount; i++) {
          if (!recordedIndices.includes(i)) {
            // 해당 질문 번호에 맞는 비디오가 존재하지 않는다면
            nextIndex = i; // 녹화 되지 않은 비디오 중 가장 낮은 인덱스
            break;
          }
        }
        setCurrentRecordingIndex(() => {
          const newIndex = nextIndex;
          // nextIndex를 이용해 currentInterviewItem을 바로 계산
          const updatedInterviewItem = mockData.interviewItems[newIndex];
          if (updatedInterviewItem) {
            setTimer(updatedInterviewItem.ReadingSeconds); // 타이머 설정
          }
          return newIndex; // 새로운 인덱스 반환
        });
      } else {
        // 면접 아이템이 없으면 초기화된 상태로 시작
        setCurrentRecordingIndex(null);
      }
      setStep(VIDEO_STEP.QUESTION);
    } else if (index === 2) {
      // '최종 녹화 리뷰' 클릭 시
      setVideoUrls([]); // 서버에서 불러온 비디오 초기화
      setStep(VIDEO_STEP.FINAL_REVIEW);
      setCurrentRecordingIndex(null);
    }
  };

  // 서브 Stpper 클릭 시, 이동 로직
  const handleSubStepperClick = (subStepIndex) => {
    // 선택한 인덱스에 해당하는 비디오 제거
    setRecordedVideosList((prevList) => prevList.filter((videoData) => videoData.questionIndex !== subStepIndex));
    // 녹화 인덱스와 스텝 업데이트
    setCurrentRecordingIndex(() => {
      const newIndex = subStepIndex;
      // subStepIndex를 이용해 currentInterviewItem을 바로 계산
      const updatedInterviewItem = mockData.interviewItems[newIndex];
      if (updatedInterviewItem) {
        setTimer(updatedInterviewItem.ReadingSeconds); // 타이머 설정
      }
      return newIndex; // 새로운 인덱스 반환
    });

    setStep(VIDEO_STEP.QUESTION);
  };

  const handleVideoUpload = async (index) => {
    const currentVideo = recordedVideosList.find((videoData) => videoData.questionIndex === currentRecordingIndex); // 업로드할 비디오 데이터
    if (!currentVideo || !currentVideo.blob) {
      console.error('업로드할 비디오가 없습니다.');
      return;
    }

    const fileName = `video_${index + 1}.mp4`;
    try {
      const url = await getUploadVideo(currentVideo.blob, fileName);
      console.log(`비디오 업로드 성공: ${url}`);
      // 업로드 성공 시 추가 작업 (예: URL 저장)
    } catch (error) {
      console.error('비디오 업로드 실패:', error);
    }
  };

  const handleLoadVideo = async () => {
    const urls = [];

    for (let i = 1; i <= interviewItemCount; i++) {
      const fileName = `video_${i}.mp4`;
      try {
        const url = await getLoadVideo(fileName);
        urls.push(url);
      } catch (error) {
        console.log('비디오 로드 실패', error);
      }
    }
    setVideoUrls(urls); // 상태 업데이트
  };

  // 기존 스토리지에 비디오 파일이 들어있다면 모두 삭제 시키는 클린업 로직
  const cleanupFiles = async (interviewItemCount) => {
    for (let i = 1; i <= interviewItemCount; i++) {
      try {
        const fileRef = ref(storage, `video_${i}.mp4`);
        await deleteObject(fileRef);
        console.log('파일 삭제 성공:', `video_${i}.mp4`);
      } catch (error) {
        console.error('파일 삭제 실패:', `video_${i}.mp4`, error);
      }
    }
  };

  // 렌더링할 컴포넌트 if, else if 활용
  const renderComponent = () => {
    return (
      <VideoRecordingInterviewComponent
        step={step}
        navigate={navigate}
        currentRecordingIndex={currentRecordingIndex}
        currentInterviewItem={currentInterviewItem}
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
        mainActiveStep={mainActiveStep}
        handleMainStepperClick={handleMainStepperClick}
        timer={timer}
        videoElement={videoElement}
        handleAnswerEndClick={handleAnswerEndClick}
        recordedVideosList={recordedVideosList}
        handleNextClick={handleNextClick}
        handleRetryClick={handleRetryClick}
        handleExitClick={handleExitClick}
        handleDownloadVideo={handleDownloadVideo}
        handleVideoUpload={handleVideoUpload}
        isUploading={isUploading}
        videoUrls={videoUrls}
        isLoading={isLoading}
        handleLoadVideo={handleLoadVideo}
        handleSubStepperClick={handleSubStepperClick}
        userInterviews={userInterviews}
        handleStartClick={handleStartClick}
      />
    );
  };

  /*
  // 로그인을 통해 인가된 Email, password를 인증해야지만 스토리지 접근 가능
  useEffect(() => {
    // 편리함을 위해 해당 프로젝트에서는 마운트 될때 자동 로그인 지원
    const email = import.meta.env.VITE_FIREBASE_EMAIL;
    const password = import.meta.env.VITE_FIREBASE_PASSWORD;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('자동 로그인 성공:', userCredential.user);
      })
      .catch((error) => {
        console.error('자동 로그인 실패:', error.message);
      });
  }, []);

  // 마운트 시 firebase storage 클린업

  useEffect(() => {
    cleanupFiles(interviewItemCount);
  }, [interviewItemCount]);
  */

  // 장치 정보를 가져오는 함수 호출 (비디오/오디오 장치 정보)
  useEffect(() => {
    getDevice();
  }, [getDevice, permissions]);

  // 장치 인풋이 존재할 때, 권한 받아오는 로직
  useEffect(() => {
    const initialize = async () => {
      if (hasVideoInput || hasAudioInput) {
        await requestPermissions();
        await checkPermissions();
      }
    };
    initialize();
  }, [hasVideoInput, hasAudioInput, requestPermissions, checkPermissions]);

  // 장치 인풋과 권한이 허용 되었을때, Stream을 받아오는 로직
  useEffect(() => {
    if (permissions.camera === 'granted' && hasVideoInput) {
      getVideoStream();
    }
    if (permissions.microphone === 'granted' && hasAudioInput) {
      getAudioStream();
    }
  }, [permissions, getVideoStream, getAudioStream, hasVideoInput, hasAudioInput]);

  // 언제든 selectId를 설정, 사용자가 선택한것이 아닌 임의적으로 디바이스가 제거 되거나 오류로 목록에서 사라진 경우, 현재 선택된 디바이스 id를 default로 초기화함
  useEffect(() => {
    // 현재 불러오는 스트림의 아이디가 현재 장치 목록에 없다면
    if (selectedVideoDeviceId && !videoDevices.some((device) => device.id === selectedVideoDeviceId)) {
      if (hasVideoInput) {
        // 비디오 장치가 있으면 첫번째 디바이스를 아이디로 설정
        setSelectedVideoDeviceId(videoDevices[0].id);
      } else {
        // 비디오 장치가 없다면 null
        setSelectedVideoDeviceId(null);
      }
    }
    if (selectedAudioDeviceId && !audioDevices.some((device) => device.id === selectedAudioDeviceId)) {
      if (hasAudioInput) {
        // 오디오 장치가 있으면 첫번째 디바이스를 아이디로 설정
        setSelectedAudioDeviceId(audioDevices[0].id);
      } else {
        // 오디오 장치가 없다면 null
        setSelectedAudioDeviceId(null);
      }
    }

    // 장치가 있을때, 사용자가 장치를 선택하지 않으면 디바이스 아이디 첫번째를 기본값 설정
    if (hasVideoInput && !selectedVideoDeviceId) {
      setSelectedVideoDeviceId(videoDevices[0].id);
    }
    if (hasAudioInput && !selectedAudioDeviceId) {
      setSelectedAudioDeviceId(audioDevices[0].id);
    }
  }, [videoDevices, audioDevices, selectedVideoDeviceId, selectedAudioDeviceId, hasVideoInput, hasAudioInput]);

  // 비디오 장치 변경 시, 해당 장치를 기준으로 Stream 재요청
  useEffect(() => {
    getVideoStream(selectedVideoDeviceId); // 새 비디오 장치로 스트림 갱신
    getAudioStream(selectedAudioDeviceId); // 새 오디오 장치로 스트림 갱신
  }, [getVideoStream, getAudioStream, selectedVideoDeviceId, selectedAudioDeviceId]);

  // 통합 스트림 생성 로직
  useEffect(() => {
    // 새로운 MediaStream을 생성하고, videoStream과 audioStream에서 트랙을 추가
    const MediaStreamRef = new MediaStream();
    if (videoStream) videoStream.getTracks().forEach((track) => MediaStreamRef.addTrack(track));
    if (audioStream) audioStream.getTracks().forEach((track) => MediaStreamRef.addTrack(track));

    // mediaStream 업데이트
    setMediaStream(MediaStreamRef);

    return () => {
      if (MediaStreamRef.current) {
        MediaStreamRef.current.getTracks().forEach((track) => track.stop());
        MediaStreamRef.current = null;
      }
    };
  }, [videoStream, audioStream]);

  // 타이머 관리 로직
  useEffect(() => {
    let interval = null;
    if (step === VIDEO_STEP.READY || step === VIDEO_STEP.QUESTION || step === VIDEO_STEP.RECORDING) {
      // 면접 질문 또는 비디오 녹화 타이머 진행
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup
  }, [step]); // step이 변경될 때마다 타이머를 재설정

  // 녹화 시작시
  useEffect(() => {
    if (isStart === true) {
      setStep(VIDEO_STEP.READY);
    }
  }, [isStart]);

  // Step에 따른 동작 처리
  useEffect(() => {
    if (timer === null) {
      // 초기 카메라 녹화 시작 상태
      setTimer(5); // 면접 시작전 마지막 준비 시간 5초
    } else if (timer === 0) {
      if (step === VIDEO_STEP.INITIAL) {
        // 모든 비디오 녹화 후 종료 시, 클린업
        setRecordedVideosList([]); // 녹화된 비디오 초기화
        setCurrentRecordingIndex(null); // 녹화 인덱스 초기화
        setTimer(null); // 타이머 초기화
        setIsStart(false); // 면접 시작 상태 초기화
      } else if (step === VIDEO_STEP.READY) {
        // 면접 준비 상태
        setStep(VIDEO_STEP.QUESTION); // 면접 질문 확인 단계
        setCurrentRecordingIndex(0);
        if (currentInterviewItem) {
          setTimer(currentInterviewItem.ReadingSeconds); // 타이머 설정
        }
      } else if (step === VIDEO_STEP.QUESTION) {
        setStep(VIDEO_STEP.RECORDING); // 녹화 단계
        if (currentInterviewItem) {
          // 참조오류 방지
          // 면접 질문 화면 끝나고 카메라 녹화 시작
          startRecording();
          setTimer(currentInterviewItem.AnswerSeconds);
        }
      } else if (step === VIDEO_STEP.RECORDING) {
        // 비디오 녹화 종료
        handleStopRecording();
        setStep(VIDEO_STEP.REVIEW); // 녹화된 비디오 확인 단계로 변경
      }
    }
  }, [step, timer, startRecording, currentInterviewItem, handleStopRecording, setStep]);

  useEffect(() => {
    if (timer !== 0) {
      if (step === VIDEO_STEP.INITIAL) {
        // 만약 ready단계에서 timer가 0이 안됐을때 이동했으면
        // 모든 비디오 녹화 후 종료 시, 클린업
        setRecordedVideosList([]); // 녹화된 비디오 초기화
        setCurrentRecordingIndex(null); // 녹화 인덱스 초기화
        setTimer(null); // 타이머 초기화
        setIsStart(false); // 면접 시작 상태 초기화
      } else if (step === VIDEO_STEP.READY) {
        // ready로 넘어가면 초기화
        setIsVideoChecked(false);
        setIsAudioChecked(false);
      }
    }
  }, [step, timer]);

  // 비디오 출력이 필요한 Step에서 videoElement 설정
  useEffect(() => {
    if (step === VIDEO_STEP.QUESTION) {
      if (videoStream && videoElement.current) {
        videoElement.current.srcObject = videoStream;
      }
    }
  }, [videoStream, step]);

  // currentRecordingIndex에 따라 다음 단계를 설정(다음 질문 확인 or 최종 녹화된 비디오 리뷰)
  useEffect(() => {
    if (currentRecordingIndex > 0) {
      setRecordedVideosList((prevList) => {
        // 현재 인덱스에 해당하는 비디오가 이미 저장되었는지 확인
        const hasExistingVideo = prevList.some((videoData) => videoData.questionIndex === currentRecordingIndex);

        // 이미 저장된 비디오가 있을 경우
        if (hasExistingVideo) {
          // 모든 비디오를 완료했으면 최종 리뷰로 이동
          if (currentRecordingIndex >= interviewItemCount - 1) {
            setStep(VIDEO_STEP.FINAL_REVIEW);
            setCurrentRecordingIndex(null);
          } else {
            // 아직 비디오가 남아 있으면 다음 질문으로 이동
            setCurrentRecordingIndex((prevIndex) => prevIndex + 1);
          }
          return prevList; // 리스트는 그대로 반환
        }

        return prevList; // 기존 비디오를 삭제하지 않음
      });

      // 이미 저장된 비디오가 없을 경우 기존 단계 전환
      if (currentRecordingIndex < interviewItemCount) {
        setStep(VIDEO_STEP.QUESTION); // 질문 확인 화면으로 전환
        setTimer(currentInterviewItem.ReadingSeconds); // 타이머 설정
      } else {
        setStep(VIDEO_STEP.FINAL_REVIEW); // 모든 비디오 리뷰 단계로 전환
        setCurrentRecordingIndex(null);
      }
    }
  }, [currentRecordingIndex, interviewItemCount, currentInterviewItem]);

  return <Box className="VideoRecordingInterview">{renderComponent()}</Box>;
};

export default VideoRecordingInterview;
