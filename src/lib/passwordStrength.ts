export interface Point {
  x: number;
  y: number;
}

/**
 * Scale points to a standard 1920x1080 resolution as expected by the detectors.
 */
export function scalePoints(points: Point[], imgWidth: number, imgHeight: number): Point[] {
  if (!imgWidth || !imgHeight) return points;
  return points.map(p => ({
    x: (p.x / imgWidth) * 1920,
    y: (p.y / imgHeight) * 1080
  }));
}

// Helper: Convex Hull (Monotone Chain)
function getConvexHull(points: Point[]): Point[] {
  const n = points.length;
  if (n <= 2) return points;
  const sorted = [...points].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
  
  const crossProduct = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower: Point[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// Helper: Perimeter
function getPerimeter(hull: Point[]): number {
  let p = 0;
  for (let i = 0; i < hull.length; i++) {
    const p1 = hull[i];
    const p2 = hull[(i + 1) % hull.length];
    p += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  return p;
}

// Helper: Area
function getArea(hull: Point[]): number {
  if (hull.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < hull.length; i++) {
    const p1 = hull[i];
    const p2 = hull[(i + 1) % hull.length];
    area += (p1.x * p2.y) - (p2.x * p1.y);
  }
  return Math.abs(area) / 2;
}

function dist(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getCircumcircle(p1: Point, p2: Point, p3: Point) {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;
  const D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  
  // If D is zero, points are collinear, handle gracefully
  if (Math.abs(D) < 0.0001) return { center: { x: (x1+x2+x3)/3, y: (y1+y2+y3)/3 }, radius: Infinity };

  const center = {
    x: ((x1**2 + y1**2) * (y2 - y3) + (x2**2 + y2**2) * (y3 - y1) + (x3**2 + y3**2) * (y1 - y2)) / D,
    y: ((x1**2 + y1**2) * (x3 - x2) + (x2**2 + y2**2) * (x1 - x3) + (x3**2 + y3**2) * (x2 - x1)) / D
  };
  return { center, radius: dist(p1, center) };
}

function simpleDelaunay(points: Point[]): number[][] {
  const n = points.length;
  const triangles: number[][] = [];
  if (n < 3) return triangles;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const p1 = points[i];
        const p2 = points[j];
        const p3 = points[k];
        
        const circum = getCircumcircle(p1, p2, p3);
        if (circum.radius === Infinity) continue;

        let ok = true;
        for (let m = 0; m < n; m++) {
          if (m === i || m === j || m === k) continue;
          if (dist(points[m], circum.center) < circum.radius - 0.001) {
            ok = false;
            break;
          }
        }
        if (ok) {
          const area = Math.abs((p1.x*(p2.y-p3.y) + p2.x*(p3.y-p1.y) + p3.x*(p1.y-p2.y))/2);
          if (area > 0.1) {
             triangles.push([i, j, k]);
          }
        }
      }
    }
  }
  return triangles;
}

/**
 * Test para determinar si una contraseña es agrupada (Test de Perímetro Convexo)
 * h=1 (true) si es agrupado
 */
export function isGrouped(points: Point[], alpha: number = 0.05): boolean {
  const hull = getConvexHull(points);
  const P = getPerimeter(hull);
  
  // JohnsonSB params: [-0.65612 1.5922 495.15 4575.1]
  const gamma = -0.65612;
  const delta = 1.5922;
  const xi = 495.15;
  const lambda = 4575.1;
  
  if (P <= xi) return true; 
  if (P >= xi + lambda) return false;
  
  const z = gamma + delta * Math.log((P - xi) / (lambda + xi - P));
  
  const percentiles: Record<number, number> = {
    0.2: -0.8416,
    0.1: -1.2816,
    0.05: -1.6449,
    0.02: -2.0537,
    0.01: -2.3263
  };
  
  const p_val = percentiles[alpha] ?? -1.6449;
  return z <= p_val;
}

/**
 * Test para determinar si una contraseña es regular (Test de Área Convexa)
 * h=1 (true) si es regular
 */
export function isRegular(points: Point[], alpha: number = 0.05): boolean {
  const hull = getConvexHull(points);
  const a = getArea(hull);
  
  const percentiles: Record<number, number> = {
    0.2: 618830,
    0.1: 725720,
    0.05: 815860,
    0.02: 918710,
    0.01: 987860
  };
  
  const p_val = percentiles[alpha] ?? 815860;
  return a >= p_val;
}

/**
 * Test para la detección de patrones suaves (DIAG y LINE)
 * h=1 (true) si es suave
 */
export function isSmooth(points: Point[], alpha: number = 0.05): boolean {
  const triangles = simpleDelaunay(points);
  if (triangles.length === 0) return false;

  let sumMaxAngles = 0;
  for (const t of triangles) {
    const p1 = points[t[0]];
    const p2 = points[t[1]];
    const p3 = points[t[2]];
    
    const d12 = dist(p1, p2);
    const d23 = dist(p2, p3);
    const d31 = dist(p3, p1);
    
    // Law of Cosines
    const a1 = Math.acos((d31**2 + d12**2 - d23**2) / (2 * d31 * d12)) * 180 / Math.PI;
    const a2 = Math.acos((d12**2 + d23**2 - d31**2) / (2 * d12 * d23)) * 180 / Math.PI;
    const a3 = Math.acos((d23**2 + d31**2 - d12**2) / (2 * d23 * d31)) * 180 / Math.PI;
    
    sumMaxAngles += Math.max(a1, a2, a3);
  }
  
  const Z = (sumMaxAngles / triangles.length - 111.8) / 17.2;
  
  const percentiles: Record<number, number> = {
    0.2: 0.8416,
    0.1: 1.2816,
    0.05: 1.6449,
    0.02: 2.0537,
    0.01: 2.3263
  };
  
  const p_val = percentiles[alpha] ?? 1.6449;
  return Z >= p_val;
}

export function validatePasswordStrength(points: Point[], imgWidth: number, imgHeight: number): { isValid: boolean, error?: string } {
  if (points.length !== 5) return { isValid: true }; // Should be handled by form validation

  const scaled = scalePoints(points, imgWidth, imgHeight);
  
  if (isGrouped(scaled)) {
    return { isValid: false, error: "Patrón muy agrupado. Por favor, distribuya más sus puntos." };
  }
  
  if (isRegular(scaled)) {
    return { isValid: false, error: "Patrón muy regular. Evite formas excesivamente simétricas o predecibles." };
  }
  
  if (isSmooth(scaled)) {
    return { isValid: false, error: "Patrón muy suave. Evite líneas rectas o diagonales perfectas." };
  }
  
  return { isValid: true };
}
