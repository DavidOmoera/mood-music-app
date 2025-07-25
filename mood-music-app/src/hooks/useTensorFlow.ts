import { useCallback } from 'react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

export const useTensorFlow = () => {
  const loadModel = useCallback(async () => {
    console.log('Loading face detection model...');
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      const model = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/models/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true,
      });
      console.log('Model loaded successfully');
      return model;
    } catch (error: any) {
      console.error('Error loading model:', {
        message: error.message,
        stack: error.stack,
      });
      try {
        console.log('Retrying with CPU delegate...');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const model = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/face_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
        });
        console.log('Model loaded successfully with CPU');
        return model;
      } catch (cpuError: any) {
        console.error('CPU fallback failed:', {
          message: cpuError.message,
          stack: cpuError.stack,
        });
        throw new Error('Failed to load face detection model');
      }
    }
  }, []);

  const detectEmotion = useCallback(async (video: HTMLVideoElement, model: FaceLandmarker) => {
    try {
      if (!video || video.readyState < 2) {
        throw new Error('Video not ready');
      }
      const detections = model.detectForVideo(video, performance.now());
      console.log('Detections:', detections);
      if (!detections.faceLandmarks || detections.faceLandmarks.length === 0) {
        throw new Error('No face detected');
      }

      const landmarks = detections.faceLandmarks[0];
      console.log('FaceLandmarks:', landmarks);
      const blendshapes = detections.faceBlendshapes && detections.faceBlendshapes[0] ? detections.faceBlendshapes[0].categories : [];
      console.log('Blendshapes:', blendshapes);

      // Use numeric indices for key facial landmarks
      const mouthLeft = landmarks[61]; // Left mouth corner
      const mouthRight = landmarks[291]; // Right mouth corner
      const mouthCenter = landmarks[0]; // Upper lip center
      const leftEyebrow = landmarks[55]; // Left eyebrow lower middle
      const rightEyebrow = landmarks[285]; // Right eyebrow lower middle
      const leftEye = landmarks[159]; // Left eye lower
      const rightEye = landmarks[386]; // Right eye lower

      const requiredKeypoints = { mouthLeft, mouthRight, mouthCenter, leftEyebrow, rightEyebrow, leftEye, rightEye };
      for (const [key, value] of Object.entries(requiredKeypoints)) {
        if (!value) {
          console.warn(`Missing keypoint: ${key}`);
          throw new Error('Key landmarks not detected');
        }
      }

      const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
      const mouthHeight = Math.abs(mouthCenter.y - mouthLeft.y);
      const eyebrowAngle = Math.atan2(rightEyebrow.y - leftEyebrow.y, rightEyebrow.x - leftEyebrow.x);
      const eyeDistance = Math.abs(rightEye.x - leftEye.x);
      const eyeAspectRatio = Math.abs(rightEye.y - leftEye.y) / eyeDistance;

      // Get blendshape scores for smile and frown
      const smileScore = blendshapes.find((b: any) => b.categoryName === '_smile')?.score || 0;
      const frownScore = blendshapes.find((b: any) => b.categoryName === '_browDown')?.score || 0;
      console.log('Facial metrics:', { mouthWidth, mouthHeight, eyebrowAngle, eyeAspectRatio, smileScore, frownScore });

      // Enhanced emotion detection logic with lower thresholds
      if (smileScore > 0.3 && mouthWidth > mouthHeight * 1.2 && Math.abs(eyebrowAngle) < 0.2 && eyeAspectRatio > 0.15) {
        return 'happy';
      } else if (frownScore > 0.2 || (mouthWidth < mouthHeight * 1.1 && eyebrowAngle > 0.1)) {
        return 'sad';
      } else if (frownScore > 0.25 && Math.abs(eyebrowAngle) > 0.15 && eyeAspectRatio < 0.15) {
        return 'angry';
      } else if (smileScore > 0.25 && mouthWidth > mouthHeight * 1.3 && eyeAspectRatio > 0.2) {
        return 'excited';
      } else if (frownScore > 0.2 && eyeAspectRatio < 0.2) {
        return 'stressed';
      } else if (mouthWidth > mouthHeight && Math.abs(eyebrowAngle) < 0.1 && smileScore > 0.15) {
        return 'relaxed';
      } else {
        return 'calm';
      }
    } catch (error: any) {
      console.error('Error detecting emotion:', {
        message: error.message,
        stack: error.stack,
      });
      throw new Error('Failed to detect emotion');
    }
  }, []);

  return { loadModel, detectEmotion };
};