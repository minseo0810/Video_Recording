import { useNavigate } from 'react-router-dom';
import mockData from '../Mock.json';
import { Box, Button, Typography, TextField, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const navigate = useNavigate();
  const interviews = mockData.userInterviews;

  return (
    <Box>
      {/* 검색 영역 */}
      <Box
        sx={{
          padding: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField fullWidth placeholder="학교명을 입력하세요." variant="outlined" />
          <IconButton color="primary">
            <SearchIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined">실전 면접</Button>
          <Button variant="outlined">모의 면접</Button>
        </Box>
      </Box>

      {/* 체크박스 및 정렬 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#eaeaea',
        }}
      >
        <FormControlLabel control={<Checkbox />} label="미등록 고사만 보기" />
        <Button variant="text" endIcon={<SearchIcon />}>
          마감 임박순
        </Button>
      </Box>

      {/* 면접 리스트 */}
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {interviews.map((interview, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: 2,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              marginBottom: 2, // 항목 간 여백 추가
            }}
          >
            <Box>
              <Typography variant="h3">{interview.ExamSetNo}</Typography> {/* 면접명 */}
              <Typography variant="h5" color="textSecondary">
                ~{' '}
                {new Date(interview.EndTime).toLocaleString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </Typography>{' '}
              {/* 제출 시간 */}
            </Box>
            <Button
              variant="contained" // 영상확인 상태일 경우 취소 버튼
              color="primary" // 영상확인일 때 색상 변경
              onClick={() => {
                navigate('/VideoRecordingInterview');
              }}
              sx={{
                width: 180,
                height: 70,
                fontSize: 26,
              }}
            >
              면접 시작
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
