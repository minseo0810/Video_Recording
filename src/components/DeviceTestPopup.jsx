import { memo } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Select, MenuItem } from '@mui/material'; // MUI
import TaskAlt from '@mui/icons-material/TaskAlt';
import HighlightOff from '@mui/icons-material/HighlightOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import AudioComponent from './AudioComponent';
import VideoComponent from './VideoComponent';

// 비디오 장치 선택 컴포넌트
const VideoDeviceSelector = memo(({ videoDevices, selectedVideoDeviceId, handleVideoDeviceChange }) => (
  <Box display="flex" alignItems="center" mb={1} borderRadius={2} bgcolor="#1e1e1e" padding={1}>
    <VideocamIcon sx={{ width: 40, height: 40, marginRight: 2, color: '#ffd94d' }} />
    <Select
      value={selectedVideoDeviceId || ''}
      onChange={handleVideoDeviceChange}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: '#ffe08a',
            '& .MuiMenuItem-root': { fontSize: '16px', '&:hover': { backgroundColor: '#ffd94d' } },
          },
        },
      }}
      sx={{
        flexGrow: 1,
        height: 30,
        fontSize: 16,
        color: 'black',
        border: 'solid 2px #ffd94d',
        backgroundColor: '#ffe08a',
        borderRadius: 2,
        '&:hover': { backgroundColor: '#ffd94d' },
        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      }}
    >
      {videoDevices.map((device) => (
        <MenuItem key={device.id} value={device.id}>
          {device.label}
        </MenuItem>
      ))}
    </Select>
  </Box>
));
VideoDeviceSelector.displayName = 'VideoDeviceSelector';

// 오디오 장치 선택 컴포넌트
const AudioDeviceSelector = memo(({ audioDevices, selectedAudioDeviceId, handleAudioDeviceChange }) => (
  <Box display="flex" alignItems="center" borderRadius={2} bgcolor="#1e1e1e" padding={1}>
    <MicIcon sx={{ width: 40, height: 40, marginRight: 2, color: '#ffd94d' }} />
    <Select
      value={selectedAudioDeviceId || ''}
      onChange={handleAudioDeviceChange}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: '#ffe08a',
            '& .MuiMenuItem-root': { fontSize: '16px', '&:hover': { backgroundColor: '#ffd94d' } },
          },
        },
      }}
      sx={{
        flexGrow: 1,
        height: 30,
        fontSize: 16,
        color: 'black',
        border: 'solid 2px #ffd94d',
        backgroundColor: '#ffe08a',
        borderRadius: 2,
        '&:hover': { backgroundColor: '#ffd94d' },
        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      }}
    >
      {audioDevices.map((device) => (
        <MenuItem key={device.id} value={device.id}>
          {device.label}
        </MenuItem>
      ))}
    </Select>
  </Box>
));
AudioDeviceSelector.displayName = 'AudioDeviceSelector';

const TestBox = memo(({ isVideoChecked, isAudioChecked, onCheckVideoDevice, onCheckAudioDevice }) => (
  <Box display="flex" justifyContent="center" gap={2}>
    <Button
      variant="contained"
      color={isVideoChecked ? 'success' : 'error'}
      startIcon={isVideoChecked ? <TaskAlt /> : <HighlightOff />}
      onClick={onCheckVideoDevice}
      sx={{
        fontSize: 16,
        fontWeight: 'bold',
        bgcolor: isVideoChecked ? '#green' : '#d32f2f',
        '&:hover': {
          bgcolor: isVideoChecked ? '#green' : '#b71c1c',
        },
      }}
    >
      카메라가 잘 보이나요?
    </Button>
    <Button
      variant="contained"
      color={isAudioChecked ? 'success' : 'error'}
      startIcon={isAudioChecked ? <TaskAlt /> : <HighlightOff />}
      onClick={onCheckAudioDevice}
      sx={{
        fontSize: 16,
        fontWeight: 'bold',
        bgcolor: isAudioChecked ? '#green' : '#d32f2f',
        '&:hover': {
          bgcolor: isAudioChecked ? '#green' : '#b71c1c',
        },
      }}
    >
      마이크 입력이 잘 들리나요?
    </Button>
  </Box>
));
TestBox.displayName = 'TestBox';

// DeviceTestPopup 메인 컴포넌트
function DeviceTestPopup({
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
}) {
  return (
    <Dialog
      open={isDeviceTestPopup}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return; // 배경 클릭 방지
        onClose();
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
          maxHeight: '95vh',
          maxWidth: '70vh',
          overflow: 'auto',
          backgroundColor: 'black',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            color: '#ffd94d',
            fontWeight: 'bold',
            fontSize: 32,
            textAlign: 'center',
            borderBottom: '2px solid #ffd94d',
            padding: 2,
          }}
        >
          장치 테스트
        </DialogTitle>

        <DialogContent
          sx={{
            color: '#ffd94d',
            padding: 3,
            marginTop: 2,
            overflow: 'auto',
            maxHeight: 'calc(90vh - 150px)',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <VideoDeviceSelector
            videoDevices={videoDevices}
            selectedVideoDeviceId={selectedVideoDeviceId}
            handleVideoDeviceChange={handleVideoDeviceChange}
          />
          <AudioDeviceSelector
            audioDevices={audioDevices}
            selectedAudioDeviceId={selectedAudioDeviceId}
            handleAudioDeviceChange={handleAudioDeviceChange}
          />

          <Box display="flex" justifyContent="center" mb={2}>
            <VideoComponent videoStream={videoStream} videoError={videoError} />
          </Box>
          <Box display="flex" justifyContent="center" mb={3}>
            <AudioComponent audioStream={audioStream} audioError={audioError} />
          </Box>

          <TestBox
            isVideoChecked={isVideoChecked}
            isAudioChecked={isAudioChecked}
            onCheckVideoDevice={onCheckVideoDevice}
            onCheckAudioDevice={onCheckAudioDevice}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant={isVideoChecked && isAudioChecked ? 'contained' : 'outlined'}
            onClick={onClose}
            sx={{
              fontSize: 18,
              fontWeight: 'bold',
              width: 150,
              border: 'solid 2px #ffd94d',
              bgcolor: isVideoChecked && isAudioChecked ? '#ffd94d' : 'transparent',
              color: isVideoChecked && isAudioChecked ? 'black' : '#ffd94d',
            }}
          >
            {isVideoChecked && isAudioChecked ? '테스트 완료' : '취소'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DeviceTestPopup;
