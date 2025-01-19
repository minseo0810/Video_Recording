import { Box, Typography } from '@mui/material';
import { memo } from 'react';

// ReadyContent 부분만 최적화하기
const ReadyContent = memo(({ userInterviews }) => (
  <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'black' }}>
    <Typography variant="h3" component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
      {userInterviews.ExamSetNo}{' '}
    </Typography>
    녹화를 준비하세요
  </Typography>
));
ReadyContent.displayName = 'ReadyContent';

function ReadyComponent({ timer, userInterviews }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        textAlign: 'center',
        opacity: 1,
        transition: 'opacity 0.5s',
      }}
    >
      <ReadyContent userInterviews={userInterviews} />
      <Typography variant="h4">
        <Typography variant="h4" component="span" sx={{ color: '#E63946' }}>
          {timer}{' '}
        </Typography>
        초 후 시작됩니다...
      </Typography>
    </Box>
  );
}

export default ReadyComponent;
