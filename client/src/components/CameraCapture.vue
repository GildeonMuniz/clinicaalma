<template>
  <div class="camera-modal" v-if="isOpen">
    <div class="camera-modal-content">
      <div class="camera-header">
        <h3>{{ title }}</h3>
        <button @click="close" class="btn-close">✕</button>
      </div>

      <div class="camera-body">
        <!-- Error message -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Camera preview -->
        <div class="camera-preview" v-show="!captured">
          <video
            ref="videoElement"
            autoplay
            playsinline
            :class="{ 'mirrored': facingMode === 'user' }"
          ></video>

          <!-- Camera overlay guides -->
          <div class="camera-overlay">
            <div class="camera-frame"></div>
            <p class="camera-hint">Posicione o documento dentro da área</p>
          </div>
        </div>

        <!-- Captured image preview -->
        <div class="image-preview" v-show="captured">
          <img :src="capturedImageUrl" alt="Captured image" v-if="capturedImageUrl">
        </div>

        <!-- Hidden canvas for capture -->
        <canvas ref="canvasElement" style="display: none;"></canvas>
      </div>

      <div class="camera-footer">
        <!-- Before capture -->
        <div v-if="!captured" class="camera-controls">
          <button
            v-if="hasMultipleCameras"
            @click="switchCamera"
            class="btn btn-secondary"
            :disabled="loading"
          >
            🔄 Trocar Câmera
          </button>

          <button
            @click="capture"
            class="btn btn-primary btn-capture"
            :disabled="loading || !cameraReady"
          >
            📷 Capturar
          </button>

          <button @click="close" class="btn btn-secondary">
            Cancelar
          </button>
        </div>

        <!-- After capture -->
        <div v-if="captured" class="camera-controls">
          <button @click="retake" class="btn btn-secondary">
            🔄 Tirar Outra
          </button>

          <button @click="confirm" class="btn btn-success">
            ✓ Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cameraService } from '../services/camera'

export default {
  name: 'CameraCapture',
  props: {
    title: {
      type: String,
      default: 'Capturar Foto'
    }
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      cameraReady: false,
      captured: false,
      capturedFile: null,
      capturedImageUrl: null,
      error: null,
      facingMode: 'environment', // 'user' or 'environment'
      hasMultipleCameras: false
    }
  },
  methods: {
    async open() {
      this.isOpen = true
      this.error = null
      this.captured = false
      this.capturedFile = null
      this.capturedImageUrl = null

      // Wait for DOM to render
      await this.$nextTick()

      // Check if camera is available
      if (!cameraService.isAvailable()) {
        this.error = 'Câmera não disponível neste dispositivo ou navegador'
        return
      }

      // Check for multiple cameras
      this.hasMultipleCameras = await cameraService.hasMultipleCameras()

      // Start camera
      this.startCamera()
    },

    async startCamera() {
      this.loading = true
      this.error = null

      try {
        await cameraService.startCamera(
          this.$refs.videoElement,
          this.facingMode
        )
        this.cameraReady = true
      } catch (error) {
        this.error = error.message
        this.cameraReady = false
      } finally {
        this.loading = false
      }
    },

    async switchCamera() {
      try {
        this.loading = true
        this.facingMode = await cameraService.switchCamera(this.$refs.videoElement)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async capture() {
      this.loading = true
      this.error = null

      try {
        // Capture photo
        this.capturedFile = await cameraService.capturePhotoAsFile(
          this.$refs.videoElement,
          this.$refs.canvasElement,
          `documento_${Date.now()}.jpg`
        )

        // Get preview URL
        this.capturedImageUrl = cameraService.getPreviewURL(this.capturedFile)

        // Mark as captured
        this.captured = true

        // Stop camera to save resources
        cameraService.stopCamera()

      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    retake() {
      // Reset capture
      this.captured = false
      this.capturedFile = null

      if (this.capturedImageUrl) {
        URL.revokeObjectURL(this.capturedImageUrl)
        this.capturedImageUrl = null
      }

      // Restart camera
      this.startCamera()
    },

    confirm() {
      if (this.capturedFile) {
        // Emit the captured file to parent
        this.$emit('captured', this.capturedFile)
        this.close()
      }
    },

    close() {
      // Stop camera
      cameraService.stopCamera()

      // Clean up preview URL
      if (this.capturedImageUrl) {
        URL.revokeObjectURL(this.capturedImageUrl)
      }

      // Reset state
      this.isOpen = false
      this.captured = false
      this.capturedFile = null
      this.capturedImageUrl = null
      this.cameraReady = false
      this.error = null
    }
  },
  beforeUnmount() {
    // Clean up camera resources
    cameraService.stopCamera()

    if (this.capturedImageUrl) {
      URL.revokeObjectURL(this.capturedImageUrl)
    }
  }
}
</script>

<style scoped>
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.camera-modal-content {
  background-color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.camera-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6b7280;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.camera-body {
  flex: 1;
  overflow: hidden;
  background-color: #000;
  position: relative;
}

.camera-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-preview video.mirrored {
  transform: scaleX(-1);
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.camera-frame {
  width: 80%;
  height: 60%;
  border: 3px solid rgba(99, 102, 241, 0.8);
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

.camera-hint {
  position: absolute;
  bottom: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.camera-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.camera-controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4f46e5;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #059669;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-capture {
  font-size: 1rem;
  padding: 0.75rem 2rem;
}

.alert {
  padding: 0.75rem 1rem;
  margin: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .camera-modal-content {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .camera-frame {
    width: 90%;
    height: 70%;
  }
}
</style>
