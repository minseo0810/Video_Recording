import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { VIDEO_STEP } from '../../constants/videoStep';

function MainStpperComponent({ step, mainActiveStep, handleMainStepperClick }) {
  return (
    <Box
      sx={{
        display: 'flex', // 플렉스 박스 활성화
        justifyContent: 'center', // 가로 방향 중앙 정렬
        alignItems: 'center', // 세로 방향 중앙 정렬
        marginTop: 1,
      }}
    >
      <Box
        sx={{
          width: '1200px',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          color: step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.RECORDING ? '#F4F3EA' : '#333D51',
          backgroundColor: step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.REVIEW ? '#2F3094' : '',
        }}
      >
        {/* 메인 Stepper */}
        {step >= VIDEO_STEP.READY && step <= VIDEO_STEP.FINAL_REVIEW && (
          <Stepper
            activeStep={mainActiveStep}
            alternativeLabel
            sx={{
              padding: 2,
              '& .MuiStepLabel-label': {
                color: step >= VIDEO_STEP.QUESTION && step <= VIDEO_STEP.REVIEW ? 'white !important' : '', // 기본 텍스트 색상 흰색
                '&:hover': {
                  cursor: 'pointer', // 마우스 모양만 변경
                },
              },
              '& .Mui-completed': {
                color: '#D3AC2B !important', // 완료된 상태 색상 적용
              },
            }}
          >
            {['면접 녹화 준비', '면접 진행', '최종 녹화 리뷰'].map((label, index) => (
              <Step key={index} onClick={() => handleMainStepperClick(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>
    </Box>
  );
}

export default MainStpperComponent;
