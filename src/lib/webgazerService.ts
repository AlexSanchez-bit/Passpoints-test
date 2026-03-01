import { KalmanFilter } from "./kalmanFilter";

let isStarted = false;
const listeners = new Set<(data: any, elapsedTime: number) => void>();

// Kalman filters for X and Y
const kalmanX = new KalmanFilter(0.01, 0.1);
const kalmanY = new KalmanFilter(0.01, 0.1);

let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

export const initWebGazer = () => {
  if (typeof window !== "undefined" && (window as any).webgazer) {
    const webgazer = (window as any).webgazer;
    if (!isStarted) {
      webgazer
        .setRegression("ridge")
        .showVideo(true)
        .showPredictionPoints(true)
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true)
        .begin();
      
      webgazer.setGazeListener((data: any, elapsedTime: number) => {
        if (data) {
          // Apply Kalman filter
          data.x = kalmanX.filter(data.x);
          data.y = kalmanY.filter(data.y);
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
    kalmanX.reset();
    kalmanY.reset();
  }
};
