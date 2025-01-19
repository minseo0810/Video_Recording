import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { VIDEO_STEP } from '../../constants/videoStep';

function SubStpperComponent({
  step,
  currentInterviewItem,
  interviewItemCount,
  handleSubStepperClick,
  recordedVideosList,
}) {
  return (
    <Box
      sx={{
        display: 'flex', // 플렉스 박스 활성화
        justifyContent: 'center', // 가로 방향 중앙 정렬
        alignItems: 'center', // 세로 방향 중앙 정렬
      }}
    >
      <Box
        sx={{
          width: '1200px',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          color: step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.RECORDING ? '#F4F3EA' : '#333D51',
          backgroundColor:
            step === VIDEO_STEP.INITIAL
              ? 'white'
              : step === VIDEO_STEP.READY
              ? 'gray'
              : step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.RECORDING
              ? '#2F3094' // 남색
              : step === VIDEO_STEP.REVIEW
              ? '#2F3094'
              : 'white',
        }}
      >
        {/* 서브 Stepper: 면접 진행 단계에서만 표시 */}
        {step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.REVIEW && (
          <Box>
            <Stepper
              activeStep={currentInterviewItem?.InterviewItemNo - 1 || 0}
              alternativeLabel
              sx={{
                padding: 2,
                '& .MuiStepLabel-label': {
                  color: 'white !important', // 기본 텍스트 색상 흰색
                  '&:hover': {
                    cursor: 'pointer', // 마우스 모양만 변경
                  },
                },
                '& .Mui-completed': {
                  color: '#D3AC2B !important', // 완료된 상태 색상 적용
                },
              }}
            >
              {Array.from({ length: interviewItemCount }, (_, index) => (
                <Step
                  key={index}
                  onClick={() => handleSubStepperClick(index)}
                  completed={recordedVideosList.some((video) => video.questionIndex === index)}
                >
                  <StepLabel>{`${index + 1}번째 질문`}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SubStpperComponent;
