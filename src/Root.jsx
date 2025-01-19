import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoRecordingInterview from './pages/VideoRecordingInterview'; // VideoRecordingInterview 컴포넌트
import Home from './pages/Home'; // Home 컴포넌트

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home 컴포넌트 */}
      <Route inert path="/VideoRecordingInterview" element={<VideoRecordingInterview />} />
      {/* VideoRecordingInterview 컴포넌트 */}
    </Routes>
  </BrowserRouter>
);

export default Root;
