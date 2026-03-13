import { KalmanFilter } from "./kalmanFilter";

let isStarted = false;
const listeners = new Set<(data: any, elapsedTime: number) => void>();

// Kalman filter for smoothing gaze
const kFilter = new KalmanFilter(0.5, 0.001);

let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

export const initWebGazer = () => {
  if (typeof window !== "undefined" && (window as any).webgazer) {
    const webgazer = (window as any).webgazer;
    if (!isStarted) {
      webgazer
        .setRegression("threadedridge")
        .showVideo(true)
        .showPredictionPoints(true)
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true)
        .begin();
      
      webgazer.setGazeListener((data: any, elapsedTime: number) => {
        if (data) {
          // Apply 2D Kalman filter
          const smoothed = kFilter.filter(data.x, data.y);
          data.x = smoothed.x;
          data.y = smoothed.y;
        }
        listeners.forEach(listener => listener(data, elapsedTime));
      });

      // Add mousemove listener for calibration
      mouseMoveHandler = (e: MouseEvent) => {
        webgazer.recordScreenPosition(e.clientX, e.clientY, 'cursor');
      };
      window.addEventListener('mousemove', mouseMoveHandler);
      
      isStarted = true;
    }
    return webgazer;
  }
};

export const subscribeGaze = (callback: (data: any, elapsedTime: number) => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const stopWebGazer = () => {
  if (typeof window !== "undefined" && (window as any).webgazer) {
    const webgazer = (window as any).webgazer;
    
    if (mouseMoveHandler) {
      window.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    
    webgazer.end();
    isStarted = false;
    listeners.clear();
    kFilter.reset();
  }
};
