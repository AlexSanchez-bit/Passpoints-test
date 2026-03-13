
export interface Point {
  x: number;
  y: number;
}

export interface Cluster extends Point {
  weight: number;
  saliency: number;
}

/**
 * Calculates a simple saliency map using local contrast/variance.
 * For performance, we downscale the image first.
 */
export async function calculateSaliency(imageSrc: string): Promise<{ map: number[][], clusters: Cluster[] }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Could not get canvas context");

      // Downscale for performance
      const scale = 0.1; 
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Convert to grayscale and calculate intensity
      const intensity = new Float32Array(width * height);
      for (let i = 0; i < data.length; i += 4) {
        intensity[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
      }

      // 2. Simple saliency: difference from local mean (box blur difference)
      // This is a crude approximation of center-surround saliency.
      const saliencyMap: number[][] = Array.from({ length: height }, () => Array(width).fill(0));
      const points: { x: number, y: number, s: number }[] = [];

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let sum = 0;
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              sum += intensity[(y + dy) * width + (x + dx)];
              count++;
            }
          }
          const mean = sum / count;
          const s = Math.abs(intensity[y * width + x] - mean);
          saliencyMap[y][x] = s;
          if (s > 0.1) { // threshold for "interesting" points
            points.push({ x: x / scale, y: y / scale, s });
          }
        }
      }

      // 3. Mean Shift Clustering on high saliency points
      const clusters = performMeanShift(points, img.width, img.height);

      resolve({ map: saliencyMap, clusters });
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

function performMeanShift(points: { x: number, y: number, s: number }[], fullWidth: number, fullHeight: number): Cluster[] {
  if (points.length === 0) return [];

  const bandwidth = Math.min(fullWidth, fullHeight) * 0.1;
  const iterations = 5;
  const clusters: Cluster[] = [];
  
  // Use a subset of points as seeds to save time
  const seeds = points.filter((_, i) => i % 10 === 0);

  for (let seed of seeds) {
    let currX = seed.x;
    let currY = seed.y;

    for (let i = 0; i < iterations; i++) {
      let shiftX = 0;
      let shiftY = 0;
      let totalWeight = 0;

      for (let p of points) {
        const distSq = (p.x - currX) ** 2 + (p.y - currY) ** 2;
        if (distSq < bandwidth ** 2) {
          // Weight by saliency and spatial distance (Gaussian-ish)
          const weight = p.s * Math.exp(-distSq / (2 * (bandwidth / 2) ** 2));
          shiftX += p.x * weight;
          shiftY += p.y * weight;
          totalWeight += weight;
        }
      }

      if (totalWeight > 0) {
        currX = shiftX / totalWeight;
        currY = shiftY / totalWeight;
      } else {
        break;
      }
    }

    // Add or merge cluster
    let found = false;
    for (let c of clusters) {
      const dSq = (c.x - currX) ** 2 + (c.y - currY) ** 2;
      if (dSq < (bandwidth / 2) ** 2) {
        c.x = (c.x + currX) / 2;
        c.y = (c.y + currY) / 2;
        c.weight++;
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({ x: currX, y: currY, weight: 1, saliency: seed.s });
    }
  }

  // Sort by weight * saliency
  return clusters.sort((a, b) => (b.weight * b.saliency) - (a.weight * a.saliency));
}

export function findNearestCluster(x: number, y: number, clusters: Cluster[], maxDist: number): Cluster | null {
  let best: Cluster | null = null;
  let maxScore = -1;
  const maxDistSq = maxDist * maxDist;

  for (const c of clusters) {
    const dSq = (c.x - x) ** 2 + (c.y - y) ** 2;
    if (dSq < maxDistSq) {
      const score = c.weight * c.saliency;
      if (score > maxScore) {
        maxScore = score;
        best = c;
      }
    }
  }
  return best;
}
