import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useTensorFlow } from '../hooks/useTensorFlow';
import { FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { FaceLandmarker } from '@mediapipe/tasks-vision';

const Camera = ({ onMoodDetected }: { onMoodDetected: (mood: string) => void }) => {
  const webcamRef = useRef<Webcam>(null);
  const { model, detectEmotion } = useTensorFlow();
  const [currentMood, setCurrentMood] = useState<string>('neutral');

  // Safe video element access
  const getVideoElement = () => {
    if (!webcamRef.current) return null;
    return webcamRef.current.video as HTMLVideoElement | null;
  };

  useEffect(() => {
    if (!model) return;
    const interval = setInterval(async () => {
      const videoElement = getVideoElement();
      if (videoElement && model) {
        try {
          const mood = await detectEmotion(videoElement, model);
          setCurrentMood(mood);
          onMoodDetected(mood);
        } catch (error: any) {
          console.error('Error detecting mood:', error);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [model, detectEmotion, onMoodDetected]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="rounded-lg shadow-md"
          videoConstraints={{
            facingMode: 'user',
            width: 640,
            height: 480,
          }}
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
          {currentMood === 'happy' ? (
            <FaceSmileIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <FaceFrownIcon className="h-6 w-6 text-blue-500" />
          )}
          <span className="font-medium capitalize">{currentMood}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Look at the camera to detect your mood
      </p>
    </div>
  );
};

export default Camera;