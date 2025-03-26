export interface MotionData {
  acceleration?: { x: number; y: number; z: number }
  rotation?: { alpha: number; beta: number; gamma: number }
  inclination?: { pitch: number; roll: number }
}

