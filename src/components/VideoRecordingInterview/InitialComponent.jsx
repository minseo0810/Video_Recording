import { Box, Button, Typography } from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import DevicesIcon from '@mui/icons-material/Devices';
import DeviceTestPopup from '../DeviceTestPopup';
import { memo } from 'react';

const Header = memo(({ navigate, userInterviews }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      width: '100%',
      justifyContent: 'flex-start',
      padding: 2,
      backgroundColor: 'white',
    }}
  >
    <Box
      component="img"
      src="/태재대학교 로고.svg"
      alt="태재대학교 로고"
      sx={{
        width: 100,
        height: 'auto',
      }}
      onClick={() => navigate('/')}
    />
    <Box onClick={() => navigate('/')} sx={{ display: 'flex', flexDirection: 'column', color: 'black' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {userInterviews.ExamSetNo}
      </Typography>
      <Typography variant="h6">연습면접 (호남지역비대면)</Typography>
      <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
        00000학과
      </Typography>
    </Box>
  </Box>
));
Header.displayName = 'Header';

const InfoBox = memo(({ interviewItemCount, estimatedInterviewTime }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      maxWidth: 750,
      gap: 2,
      flexWrap: 'wrap',
    }}
  >
    {[
      { label: '문항수', value: interviewItemCount + '개' },
      { label: '예상 면접 시간', value: estimatedInterviewTime },
      { label: '응시 기간', value: '2024.01.01 ~ 2024.12.31' },
    ].map((info, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 15px',
          backgroundColor: '#F8F9FA',
          color: '#333d51',
          border: '4px solid #2c2d87',
          borderRadius: '5px',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 30,
            whiteSpace: 'nowrap',
            marginBottom: '1px',
          }}
        >
          {info.label}
        </Typography>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 25,
            marginBottom: '5px',
          }}
        >
          {info.value}
        </Typography>
      </Box>
    ))}
  </Box>
));
InfoBox.displayName = 'InfoBox';

const MainContent = memo(() => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: 720,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        wordBreak: 'keep-all',
        textAlign: 'left',
      }}
    >
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: 40,
          color: '#2c2d87',
        }}
      >
        안내 및 주의사항
      </Typography>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: 25,
          marginBottom: 2,
        }}
      >
        비대면 녹화 면접 유의사항
      </Typography>
      <Box component="ol" sx={{ marginLeft: 2, marginBottom: 2 }}>
        {[
          'PC에서 ‘카메라’, ‘마이크’ 사용권한을 요청할 때, 반드시 ‘승인’ 또는 ‘허용’해야 합니다.',
          '응시 중 네트워크 연결이 끊길 수 있으므로 안정된 인터넷 환경을 권장합니다.',
          '카메라를 응시하면서 답변하고, 이어폰 착용을 권장합니다.',
          '응시 중 다른 화면으로 이동하거나 이탈할 수 없습니다.',
        ].map((text, index) => (
          <Typography
            key={index}
            variant="h6"
            component="li"
            sx={{
              fontWeight: 'bold',
              marginBottom: 1,
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: 25,
          marginTop: 4,
        }}
      >
        유의사항을 모두 확인하셨다면{' '}
        <Typography
          component="span"
          sx={{
            fontWeight: 'bold',
            fontSize: 25,
            color: '#E63946',
          }}
        >
          디바이스 테스트를 완료한 후{' '}
        </Typography>
        면접을 응시해주세요.
      </Typography>
    </Box>
  </Box>
));
MainContent.displayName = 'MainContent';

const ActionButtons = memo(({ onDeviceTestPopup, handleStartClick, isAudioChecked, isVideoChecked }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 720,
    }}
  >
    <Button
      variant="contained"
      endIcon={<DevicesIcon fontSize="inherit" sx={{ width: 40, height: 40 }} />}
      onClick={onDeviceTestPopup}
      sx={{
        width: '48%',
        height: 60,
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: 'black',
      }}
    >
      디바이스 테스트
    </Button>
    <Button
      variant="contained"
      endIcon={<StartIcon fontSize="inherit" sx={{ width: 40, height: 40 }} />}
      onClick={handleStartClick}
      disabled={!(isAudioChecked && isVideoChecked)}
      sx={{
        width: '48%',
        height: 60,
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: 'blue',
      }}
    >
      면접 녹화 시작
    </Button>
  </Box>
));
ActionButtons.displayName = 'ActionButtons';

function InitialComponent({
  navigate,
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
  userInterviews,
  handleStartClick,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        padding: 2,
      }}
    >
      {/* 상단 로고와 텍스트 */}
      <Header navigate={navigate} userInterviews={userInterviews} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // 상단 안내 박스, 중간 본문, 하단 버튼을 적절히 분배
          alignItems: 'center',
          width: '850px',
          height: '750',
          padding: 4,
          gap: 2,
          border: 'solid 5px #f9dd01',
          backgroundColor: 'white',
        }}
      >
        {/* 상단 안내 박스 */}
        <InfoBox interviewItemCount={interviewItemCount} estimatedInterviewTime={estimatedInterviewTime} />

        {/* 중간 본문 */}
        <MainContent />

        {/* 하단 버튼 그룹 */}
        <ActionButtons
          onDeviceTestPopup={onDeviceTestPopup}
          handleStartClick={handleStartClick}
          isAudioChecked={isAudioChecked}
          isVideoChecked={isVideoChecked}
        />
      </Box>

      {/* DeviceTestPopup */}
      <DeviceTestPopup
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
      />
    </Box>
  );
}

export default InitialComponent;
