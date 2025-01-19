import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

function AudioComponent({ audioStream, audioError }) {
  const canvasRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);
  const [threshold, setThreshold] = useState(128);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (audioStream) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(audioStream);
      const gainNode = audioCtx.createGain();

      source.connect(gainNode).connect(analyserNode);
      analyserNode.fftSize = 2048;

      gainNode.connect(audioCtx.destination);

      audioContextRef.current = audioCtx;
      setAnalyser(analyserNode);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioStream]);

  useEffect(() => {
    const draw = () => {
      if (!analyser || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      const maxFrequency = Math.max(...dataArray);
      const barWidth = (maxFrequency / 256) * canvas.width;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = maxFrequency > threshold ? 'rgb(0, 255, 0)' : 'rgb(0, 0, 255)';
      canvasCtx.fillRect(0, 0, barWidth, canvas.height);
      // 입력음력 한계점 UI
      canvasCtx.fillStyle = 'rgb(255, 0, 0)';
      const thresholdPosition = (threshold / 256) * canvas.width;
      canvasCtx.fillRect(thresholdPosition, 0, 2, canvas.height);

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser, threshold]);

  if (audioError) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          마이크 장치에 문제가 발생했습니다.
        </Typography>
        <Typography variant="body2" color="white">
          마이크 권한은 허용되어있는지, 앱이 바이러스 백신 소프트웨어에 의해 차단되어 있지는 않은지, 마이크 드라이버는
          최신 버전인지 확인하고, PC에 연결된 마이크가 제대로 설치되었는지 확인하세요. 마이크에 물리적 스위치가 있을
          경우, 켜져 있는지 확인하세요.
        </Typography>
        <Typography variant="body2" color="error">
          Error :{audioError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box width={550} height={50}>
      <Box display="flex" alignItems="center" justifyContent="center" width="100%">
        <VolumeUpIcon fontSize="inherit" sx={{ width: 40, height: 40, marginRight: 1 }} />
        <canvas
          ref={canvasRef}
          width="420"
          height="30"
          style={{ borderRadius: 5, border: '1px solid #ffd94d' }}
        ></canvas>
      </Box>
      {/* 입력음량 한계점 슬라이더*/}
      <Box width={510} display="flex" alignItems="center">
        <Typography width={90} variant="body1" marginRight={2}>
          입력 음량
        </Typography>
        <Slider value={threshold} min={0} max={255} onChange={(e, newValue) => setThreshold(newValue)} />
      </Box>
    </Box>
  );
}

export default AudioComponent;
