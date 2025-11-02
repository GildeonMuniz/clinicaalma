/**
 * Camera Service
 * Handles camera access and image capture for mobile devices
 */

export class CameraService {
  constructor() {
    this.stream = null
    this.videoElement = null
    this.canvasElement = null
  }

  /**
   * Check if camera is available in this browser
   */
  isAvailable() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  /**
   * Get available cameras (front and back)
   */
  async getAvailableCameras() {
    if (!this.isAvailable()) {
      throw new Error('Camera API not available in this browser')
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(device => device.kind === 'videoinput')
  }

  /**
   * Start camera stream
   * @param {HTMLVideoElement} videoElement - Video element to display stream
   * @param {string} facingMode - 'user' (front) or 'environment' (back)
   */
  async startCamera(videoElement, facingMode = 'environment') {
    if (!this.isAvailable()) {
      throw new Error('Camera not available on this device')
    }

    try {
      // Stop existing stream if any
      this.stopCamera()

      // Request camera access
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement = videoElement

      // Attach stream to video element
      videoElement.srcObject = this.stream
      await videoElement.play()

      return {
        success: true,
        message: 'Camera started successfully'
      }
    } catch (error) {
      console.error('Error accessing camera:', error)

      let errorMessage = 'Failed to access camera'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application'
      }

      throw new Error(errorMessage)
    }
  }

  /**
   * Stop camera stream
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
    }
  }

  /**
   * Capture photo from video stream
   * @param {HTMLVideoElement} videoElement - Video element with active stream
   * @param {HTMLCanvasElement} canvasElement - Canvas to draw the captured image
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<Blob>} - Captured image as Blob
   */
  async capturePhoto(videoElement, canvasElement, quality = 0.92) {
    if (!videoElement || !videoElement.srcObject) {
      throw new Error('No active camera stream')
    }

    // Set canvas size to match video
    canvasElement.width = videoElement.videoWidth
    canvasElement.height = videoElement.videoHeight

    // Draw current video frame to canvas
    const context = canvasElement.getContext('2d')
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)

    // Convert canvas to Blob
    return new Promise((resolve, reject) => {
      canvasElement.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to capture image'))
          }
        },
        'image/jpeg',
        quality
      )
    })
  }

  /**
   * Capture photo and convert to File object
   * @param {HTMLVideoElement} videoElement
   * @param {HTMLCanvasElement} canvasElement
   * @param {string} filename
   * @returns {Promise<File>}
   */
  async capturePhotoAsFile(videoElement, canvasElement, filename = 'captured-image.jpg') {
    const blob = await this.capturePhoto(videoElement, canvasElement)
    return new File([blob], filename, { type: 'image/jpeg' })
  }

  /**
   * Get preview URL from captured photo
   * @param {Blob} blob
   * @returns {string} - Object URL
   */
  getPreviewURL(blob) {
    return URL.createObjectURL(blob)
  }

  /**
   * Switch between front and back camera
   * @param {HTMLVideoElement} videoElement
   */
  async switchCamera(videoElement) {
    const currentFacingMode = this.stream?.getVideoTracks()[0]?.getSettings()?.facingMode

    let newFacingMode = 'environment'
    if (currentFacingMode === 'environment') {
      newFacingMode = 'user'
    }

    await this.startCamera(videoElement, newFacingMode)
    return newFacingMode
  }

  /**
   * Check if device has multiple cameras
   */
  async hasMultipleCameras() {
    const cameras = await this.getAvailableCameras()
    return cameras.length > 1
  }

  /**
   * Apply image enhancements (for better OCR)
   * @param {HTMLCanvasElement} canvasElement
   */
  enhanceForOCR(canvasElement) {
    const context = canvasElement.getContext('2d')
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height)
    const data = imageData.data

    // Increase contrast and brightness for better OCR
    const contrast = 1.2
    const brightness = 10

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast and brightness
      data[i] = ((data[i] - 128) * contrast + 128) + brightness       // Red
      data[i + 1] = ((data[i + 1] - 128) * contrast + 128) + brightness // Green
      data[i + 2] = ((data[i + 2] - 128) * contrast + 128) + brightness // Blue
    }

    context.putImageData(imageData, 0, 0)
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopCamera()
    this.videoElement = null
    this.canvasElement = null
  }
}

// Export singleton instance
export const cameraService = new CameraService()
export default cameraService
