import { Injectable } from "@angular/core"
import { Motion } from "@capacitor/motion"
import type { PluginListenerHandle } from "@capacitor/core"
import type { MotionData } from "../Model/MotionData.model"

@Injectable({
  providedIn: "root",
})
export class MotionService {
  private accelListener?: PluginListenerHandle
  private gyroListener?: PluginListenerHandle

  constructor() {}

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {}

    this.accelListener = await Motion.addListener("accel", (event) => {
      motionData.acceleration = event.acceleration

      // Calcular ángulos de inclinación usando el acelerómetro
      if (event.acceleration) {
        const { x, y, z } = event.acceleration

        // Calcular pitch (inclinación adelante/atrás) en grados
        // atan2 devuelve radianes, convertimos a grados
        const pitch = Math.round(Math.atan2(-x, Math.sqrt(y * y + z * z)) * (180 / Math.PI))

        // Calcular roll (inclinación lateral) en grados
        const roll = Math.round(Math.atan2(y, z) * (180 / Math.PI))

        motionData.inclination = { pitch, roll }
      }

      callback(motionData)
    })

    this.gyroListener = await Motion.addListener("orientation", (event) => {
      motionData.rotation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      }
      callback(motionData)
    })
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove()
    }
    if (this.gyroListener) {
      await this.gyroListener.remove()
    }
  }
}

