import { Box, Button, Typography } from '@mui/material';
import { VIDEO_STEP } from '../../constants/videoStep';
import { memo } from 'react';

// ReadyContent 부분만 최적화하기
const QuestionContent = memo(({ step, currentInterviewItem, navigate }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: '5%', // 화면 하단에서 10% 떨어진 위치
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      left: '50%',
      transform: 'translate(-45%, 0)', // 수평 중앙 정렬
      color: 'white',
      backgroundColor: 'blue',
      padding: 1,
      wordBreak: 'keep-all',
      width: '80%',
      display: 'flex', // Flexbox 활성화
      alignItems: 'center', // 세로축 가운데 정렬
      gap: 2, // 아이템 간 간격
      opacity: step === VIDEO_STEP.RECORDING ? 0.4 : 1, // RECORDING 단계에서는 투명도 조정
    }}
  >
    <Box
      component="img"
      src="/질문 로고.svg"
      alt="질문 로고"
      sx={{
        width: 80, // 로고 크기 조정
        height: 'auto',
        position: 'absolute', // 부모 박스를 기준으로 위치 설정
        top: '50%', // 수직 중앙 정렬
        left: '-50px', // 박스 왼쪽 바깥으로 이동
        transform: 'translateY(-50%)', // 정확한 수직 중앙 정렬
      }}
      onClick={() => {
        navigate('/');
      }}
    />
    <Box width={25} />
    <Typography
      variant="h7"
      sx={{
        fontWeight: 'bold',
      }}
    >
      {currentInterviewItem.InterviewItemNo}. {currentInterviewItem.InterviewQuestion}
    </Typography>
  </Box>
));
QuestionContent.displayName = 'QuestionContent';

const AnswerEndContent = memo(({ currentInterviewItem, handleAnswerEndClick }) => (
  <>
    <Button
      variant="contained"
      onClick={handleAnswerEndClick}
      color="error"
      sx={{
        flex: 1, // 3등분된 영역 중 두 번째
        margin: '0 auto',
        maxWidth: '100px',
      }}
    >
      답변 종료
    </Button>

    <Typography
      variant="h6"
      sx={{
        flex: 1, // 3등분된 영역 중 세 번째
        textAlign: 'center',
        fontWeight: 'bold',
        width: '270px',
      }}
    >
      최소 답변 시간 {currentInterviewItem.MinimumAnswerSeconds}초
    </Typography>
  </>
));
AnswerEndContent.displayName = 'AnswerEndContent';

function QuestionOrRecordingComponent({
  videoElement,
  step,
  navigate,
  currentInterviewItem,
  timer,
  handleAnswerEndClick,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 800,
          height: 600,
          backgroundColor: 'black',
          margin: '0 auto',
          border: 'solid 5px #D3AC2B ',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 5,
        }}
      >
        <video
          ref={videoElement}
          autoPlay
          playsInline
          muted
          width={800}
          height={600}
          style={{
            opacity: step === VIDEO_STEP.QUESTION ? 0.4 : 1, // 면접 질문 확인 화면일 때는 비디오 흐릿하게 처리
          }}
        />

        <QuestionContent step={step} currentInterviewItem={currentInterviewItem} navigate={navigate} />
      </Box>

      {step === VIDEO_STEP.QUESTION && (
        <Box
          sx={{
            height: 68.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {timer}초 후 면접 녹화 시작
          </Typography>
        </Box>
      )}

      {step === VIDEO_STEP.RECORDING && ( // 면접 답변 녹화 화면
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '800',
            textAlign: 'center',
            paddingBottom: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flex: 1, // 3등분된 영역 중 첫 번째
              textAlign: 'center',
              fontWeight: 'bold',
              width: '270px',
            }}
          >
            {timer}초 후 녹화 종료
          </Typography>

          <AnswerEndContent currentInterviewItem={currentInterviewItem} handleAnswerEndClick={handleAnswerEndClick} />
        </Box>
      )}
    </Box>
  );
}

export default QuestionOrRecordingComponent;
