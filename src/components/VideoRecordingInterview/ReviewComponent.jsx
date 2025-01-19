import { Box, Button, Typography } from '@mui/material';

// eslint-disable-next-line react/display-name
function ReviewComponent({
  currentRecordingIndex,
  recordedVideosList,
  handleNextClick,
  handleRetryClick,
  handleDownloadVideo,
  isUploading,
  handleVideoUpload,
}) {
  return (
    <Box key={currentRecordingIndex} sx={{ textAlign: 'center', marginTop: 2 }}>
      <Box
        sx={{
          width: 800,
          height: 600,
          backgroundColor: 'black',
          margin: '0 auto',
          border: 'solid 5px #D3AC2B',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 5,
        }}
      >
        {recordedVideosList.some((videoData) => videoData.questionIndex === currentRecordingIndex) ? (
          <video
            src={recordedVideosList.find((videoData) => videoData.questionIndex === currentRecordingIndex).videoUrl}
            controls
            width={800}
            height={600}
            preload="auto"
            onLoadedMetadata={() => {}} // 메타데이터를 로드 하지 않으면 비디오 화면 멈춤 현상 발생
          />
        ) : (
          <Typography color="white"></Typography>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex', // 가로로 배치
          justifyContent: 'space-between', // 양쪽 끝으로 배치
          alignItems: 'center', // 수직 중앙 정렬
          gap: 4, // 자식 요소 간의 간격
          marginTop: 2,
          width: 800, // 너비 고정
          margin: '0 auto', // 중앙 정렬
        }}
      >
        {/* 첫 번째 박스: '다음'과 '재시도' 버튼 */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, paddingBottom: 2 }}>
          <Button variant="contained" onClick={handleNextClick} sx={{ backgroundColor: '#2F3094' }}>
            다음
          </Button>
          <Button variant="outlined" onClick={handleRetryClick} sx={{ color: '#2F3094', border: 'solid 1px #2F3094' }}>
            재시도
          </Button>
        </Box>

        {/* 두 번째 박스: 업로드 버튼과 진행률 및 비디오 불러오기 */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, paddingBottom: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleDownloadVideo(currentRecordingIndex)}
            sx={{ backgroundColor: '#2F3094' }}
          >
            비디오 다운로드
          </Button>
          <Button
            variant="contained"
            onClick={() => handleVideoUpload(currentRecordingIndex)}
            disabled={isUploading}
            sx={{ backgroundColor: '#2F3094' }}
          >
            {isUploading ? '업로드 중...' : '비디오 업로드'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ReviewComponent;
