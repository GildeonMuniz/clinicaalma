<template>
  <div class="sync-status" :class="statusClass">
    <div class="sync-indicator">
      <span class="status-icon">{{ statusIcon }}</span>
      <span class="status-text">{{ statusText }}</span>
    </div>

    <div v-if="syncQueueCount > 0" class="sync-queue">
      <span class="queue-count">{{ syncQueueCount }} pendentes</span>
      <button @click="syncNow" class="btn-sync" :disabled="!isOnline || isSyncing">
        {{ isSyncing ? '⏳' : '🔄' }}
      </button>
    </div>
  </div>
</template>

<script>
import syncService from '../services/sync-service'

export default {
  name: 'SyncStatus',
  data() {
    return {
      isOnline: navigator.onLine,
      isSyncing: false,
      syncQueueCount: 0,
      lastSyncMessage: ''
    }
  },
  computed: {
    statusClass() {
      return {
        'status-online': this.isOnline,
        'status-offline': !this.isOnline,
        'status-syncing': this.isSyncing
      }
    },
    statusIcon() {
      if (this.isSyncing) return '🔄'
      return this.isOnline ? '🟢' : '🔴'
    },
    statusText() {
      if (this.isSyncing) return 'Sincronizando...'
      return this.isOnline ? 'Online' : 'Offline'
    }
  },
  methods: {
    async updateSyncQueueCount() {
      this.syncQueueCount = await syncService.getSyncQueueCount()
    },
    async syncNow() {
      if (!this.isOnline || this.isSyncing) return

      this.isSyncing = true
      await syncService.syncAll()
      await this.updateSyncQueueCount()
      this.isSyncing = false
    },
    handleSyncEvent(event) {
      switch (event.type) {
        case 'online':
          this.isOnline = true
          break
        case 'offline':
          this.isOnline = false
          break
        case 'sync_start':
          this.isSyncing = true
          break
        case 'sync_complete':
          this.isSyncing = false
          this.updateSyncQueueCount()
          break
        case 'sync_error':
          this.isSyncing = false
          break
        case 'queue_add':
          this.updateSyncQueueCount()
          break
      }
    }
  },
  mounted() {
    // Initial queue count
    this.updateSyncQueueCount()

    // Listen for sync events
    syncService.addListener(this.handleSyncEvent)

    // Listen for online/offline
    window.addEventListener('online', () => {
      this.isOnline = true
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Auto-update queue count every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateSyncQueueCount()
    }, 30000)
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }
}
</script>

<style scoped>
.sync-status {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  transition: all 0.3s;
}

.sync-status.status-syncing {
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
}

.sync-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  font-size: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

.status-online .status-icon {
  animation: none;
}

.status-text {
  font-weight: 500;
  color: #374151;
}

.sync-queue {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid #e5e7eb;
}

.queue-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.btn-sync {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.btn-sync:hover:not(:disabled) {
  transform: rotate(180deg);
}

.btn-sync:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .sync-status {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .status-icon {
    font-size: 0.875rem;
  }
}
</style>
