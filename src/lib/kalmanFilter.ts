/**
 * A simple 1D Kalman Filter implementation for smoothing values.
 */
export class KalmanFilter {
  private Q: number; // Process noise covariance
  private R: number; // Measurement noise covariance
  private x: number | null = null; // Estimated value
  private p: number = 1; // Estimation error covariance
  private k: number = 0; // Kalman gain

  /**
   * @param Q Process noise (lower = smoother but slower to react)
   * @param R Measurement noise (higher = more trust in model than measurement)
   */
  constructor(Q: number = 0.001, R: number = 0.1) {
    this.Q = Q;
    this.R = R;
  }

  /**
   * Updates the filter with a new measurement.
   * @param measurement The new raw value
   * @returns The smoothed value
   */
  filter(measurement: number): number {
    if (this.x === null) {
      this.x = measurement;
      return measurement;
    }

    // Prediction update
    this.p = this.p + this.Q;

    // Measurement update
    this.k = this.p / (this.p + this.R);
    this.x = this.x + this.k * (measurement - this.x);
    this.p = (1 - this.k) * this.p;

    return this.x;
  }

  reset() {
    this.x = null;
    this.p = 1;
  }
}
