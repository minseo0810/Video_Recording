import { Box, Button, Typography } from '@mui/material';

function ReviewComponent({ recordedVideosList, videoUrls, handleLoadVideo, isLoading, handleExitClick }) {
  return (
    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {recordedVideosList
          .slice() // 원본 배열을 수정하지 않도록 복사본 생성
          .sort((a, b) => a.questionIndex - b.questionIndex) // questionIndex 기준으로 정렬
          .map((videoData, index) => (
            <Box key={index} mb={2} sx={{ position: 'relative', width: 320, height: 260 }}>
              <Box
                mb={1}
                sx={{
                  backgroundColor: 'black',
                  border: 'solid 5px #D3AC2B',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  position: 'relative',
                  width: 320,
                  height: 240,
                }}
              >
                <video
                  src={videoData.videoUrl}
                  controls
                  width="320px"
                  height="240px"
                  preload="auto"
                  onLoadedMetadata={() => {}} // 메타데이터를 로드하지 않으면 비디오 화면 멈춤 현상 발생
                />
              </Box>
              {/* 비디오 아래에 질문 인덱스 표시 */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '14px',
                  display: 'block',
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                }}
              >
                질문 {videoData.questionIndex + 1}
              </Typography>
            </Box>
          ))}
      </Box>

      {videoUrls && videoUrls.length > 0 && (
        <Box>
          <Typography variant="h3" mt={3} mb={3}>
            서버에서 불러온 비디오
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {videoUrls.map((url, index) => (
              <Box key={index} mb={2} sx={{ position: 'relative', width: 320, height: 260 }}>
                <Box
                  mb={1}
                  sx={{
                    backgroundColor: 'black',
                    border: 'solid 5px #D3AC2B',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    position: 'relative',
                    width: 320,
                    height: 240,
                  }}
                >
                  <video src={url} controls width="320px" height="240px" preload="auto" />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '14px',
                    display: 'block',
                    fontWeight: 'bold',
                    color: 'black',
                    textAlign: 'center',
                  }}
                >
                  질문 {index + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 3 }}>
        <Button variant="contained" sx={{ marginTop: 2, backgroundColor: '#2F3094' }} onClick={handleExitClick}>
          종료
        </Button>
        <Button
          variant="contained"
          sx={{ marginTop: 2, backgroundColor: '#2F3094' }}
          onClick={handleLoadVideo}
          disabled={isLoading} // 로딩 중일 때 버튼 비활성화
        >
          {isLoading ? '불러오는 중...' : '업로드된 비디오 불러오기'}
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewComponent;
