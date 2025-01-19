import { useRef, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

function VideoComponent({ videoStream, videoError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  if (videoError) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          카메라 장치에 문제가 발생했습니다.
        </Typography>
        <Typography variant="body2" color="white">
          카메라 권한은 허용되어있는지, 앱이 바이러스 백신 소프트웨어에 의해 차단되어 있지는 않은지, 카메라 드라이버는
          최신 버전인지 확인하고, PC에 연결된 카메라가 제대로 설치되었는지 확인하세요. 카메라에 물리적 스위치가 있을
          경우, 켜져 있는지 확인하세요.
        </Typography>
        <Typography variant="body2" color="error">
          Error : {videoError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: 480,
        height: 360,
        backgroundColor: 'black',
        border: 'solid 2px #D3AC2B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 4,
      }}
    >
      <video ref={videoRef} autoPlay playsInline muted width={480} height={360} />
    </Box>
  );
}

export default VideoComponent;
