export interface Point {
  x: number;
  y: number;
}

export interface ImageInfo {
  width: number;
  height: number;
  name?: string;
}

export interface PasswordInfo {
  points: Point[];
  tolerance: number;
  image: ImageInfo;
}
