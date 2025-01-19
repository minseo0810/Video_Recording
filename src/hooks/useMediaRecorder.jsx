import { useRef, useCallback } from 'react';
import RecordRTC from 'recordrtc';

function useMediaRecorder({ mediaStream }) {
  const mediaRecorderRef = useRef(null);

  const loadEBML = () => {
    return new Promise((resolve, reject) => {
      if (window.EBML) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.webrtc-experiment.com/EBML.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  };

  // 녹화 시작 함수
  const startRecording = useCallback(() => {
    try {
      if (!mediaStream) {
        console.error('녹화할 스트림이 없습니다.');
        return;
      }

      // 'video/webm' 형식으로 Blob 생성
      mediaRecorderRef.current = new RecordRTC(mediaStream, {
        type: 'video',
        mimeType: 'video/webm', // WebM 형식과 코덱 설정
      });

      mediaRecorderRef.current.startRecording();
    } catch {
      return;
    }
  }, [mediaStream]);

  // 녹화 종료 후 seekable Blob 반환 함수
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      loadEBML()
        .then(() => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stopRecording(() => {
              try {
                const blob = mediaRecorderRef.current.getBlob();

                // Blob이 비어있거나 잘못된 타입인지 확인
                if (!blob || blob.size === 0 || !blob.type.startsWith('video/')) {
                  console.error('잘못된 Blob:', blob);
                  resolve(new Blob()); // 잘못된 Blob이면 빈 Blob 반환
                  return;
                }
                console.log(blob);
                // 유효한 Blob인 경우 seekable Blob 생성
                RecordRTC.getSeekableBlob(blob, (seekableBlob) => {
                  resolve(seekableBlob);
                });
              } catch (error) {
                console.error('Blob 처리 중 오류 발생:', error);
                resolve(new Blob()); // 오류 발생 시 빈 Blob 반환
              }
            });
          } else {
            console.log('MediaRecorder가 초기화되지 않았습니다.');
            resolve(new Blob()); // MediaRecorder 미초기화 시 빈 Blob 반환
          }
        })
        .catch((error) => {
          console.error('EBML.js 로드에 실패했습니다:', error);
          resolve(new Blob()); // EBML.js 로드 실패 시 빈 Blob 반환
        });
    });
  }, []);

  return {
    startRecording,
    stopRecording,
  };
}

export default useMediaRecorder;
