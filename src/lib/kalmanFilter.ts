// @ts-ignore
import { KalmanFilter as KalmanFilterLib } from 'kalman-filter';

/**
 * A wrapper for the kalman-filter library providing a simple 2D filtering interface.
 */
export class KalmanFilter {
  private kf: any;
  private lastState: any = null;

  constructor(observationNoise: number = 0.5, processNoise: number = 0.001) {
    // We must specify 'name: sensor' for the library to use sensorDimension/sensorCovariance
    // to build the actual covariance and stateProjection matrices.
    this.kf = new KalmanFilterLib({
      observation: {
        name: 'sensor',
        sensorDimension: 2,
        sensorCovariance: [
          [observationNoise, 0],
          [0, observationNoise]
        ],
      },
      dynamic: {
        name: 'constant-position',
        dimension: 2,
        covariance: [
          [processNoise, 0],
          [0, processNoise]
        ],
      }
    });
  }

  /**
   * Updates the filter with a new measurement [x, y].
   * @param x 
   * @param y 
   * @returns The smoothed [x, y]
   */
  filter(x: number, y: number): { x: number, y: number } {
    const observation = [x, y];
    
    // Online filtering
    // The library expects an observation as an array
    this.lastState = this.kf.filter({
      observation,
      previousState: this.lastState
    });

    // The state mean in this library is a matrix (column vector)
    const mean = this.lastState.mean;
    
    return {
      x: Array.isArray(mean[0]) ? mean[0][0] : mean[0],
      y: Array.isArray(mean[1]) ? mean[1][0] : mean[1]
    };
  }

  reset() {
    this.lastState = null;
  }
}
