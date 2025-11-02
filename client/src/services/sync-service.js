/**
 * Sync Service
 * Manages offline data synchronization between Firebase and backend server
 */

import api, { pacientesAPI, fichasAPI } from './api'
import localforage from 'localforage'
import firebaseService from './firebase'

// LocalForage configuration for offline storage
const offlineStore = localforage.createInstance({
  name: 'clinica-alma',
  storeName: 'offline_data'
})

const syncQueueStore = localforage.createInstance({
  name: 'clinica-alma',
  storeName: 'sync_queue'
})

/**
 * Sync Service Class
 */
class SyncService {
  constructor() {
    this.isOnline = navigator.onLine
    this.isSyncing = false
    this.syncListeners = []

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())
  }

  /**
   * Check if currently online
   */
  checkOnlineStatus() {
    return this.isOnline
  }

  /**
   * Handle online event
   */
  async handleOnline() {
    console.log('🌐 Connection restored - Starting sync...')
    this.isOnline = true
    this.notifyListeners({ type: 'online', message: 'Connection restored' })

    // Auto-sync when coming back online
    await this.syncAll()
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    console.log('📡 Connection lost - Working offline')
    this.isOnline = false
    this.notifyListeners({ type: 'offline', message: 'Working offline' })
  }

  /**
   * Add listener for sync events
   */
  addListener(callback) {
    this.syncListeners.push(callback)
  }

  /**
   * Notify all listeners
   */
  notifyListeners(data) {
    this.syncListeners.forEach(callback => callback(data))
  }

  /**
   * Save data locally when offline
   */
  async saveOffline(key, data) {
    try {
      await offlineStore.setItem(key, {
        data,
        timestamp: Date.now(),
        synced: false
      })
      console.log(`💾 Data saved offline: ${key}`)
      return true
    } catch (error) {
      console.error('Error saving offline data:', error)
      return false
    }
  }

  /**
   * Get offline data
   */
  async getOffline(key) {
    try {
      const item = await offlineStore.getItem(key)
      return item ? item.data : null
    } catch (error) {
      console.error('Error getting offline data:', error)
      return null
    }
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(action, data, metadata = {}) {
    const queueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action, // 'create_paciente', 'create_ficha', 'upload_image'
      data,
      metadata,
      status: 'pending',
      created_at: new Date().toISOString(),
      retry_count: 0,
      last_error: null
    }

    // Save to local queue
    await syncQueueStore.setItem(queueItem.id, queueItem)

    // Also save to Firebase if available
    if (firebaseService.isConfigured()) {
      try {
        await firebaseService.addToSyncQueue(action, data)
      } catch (error) {
        console.warn('Could not add to Firebase sync queue:', error)
      }
    }

    console.log(`📋 Added to sync queue: ${action}`)
    this.notifyListeners({
      type: 'queue_add',
      message: `Added ${action} to sync queue`,
      queueItem
    })

    return queueItem.id
  }

  /**
   * Get pending sync items
   */
  async getPendingSyncItems() {
    const items = []
    await syncQueueStore.iterate((value) => {
      if (value.status === 'pending') {
        items.push(value)
      }
    })

    // Sort by creation time
    return items.sort((a, b) =>
      new Date(a.created_at) - new Date(b.created_at)
    )
  }

  /**
   * Get sync queue count
   */
  async getSyncQueueCount() {
    const items = await this.getPendingSyncItems()
    return items.length
  }

  /**
   * Sync a single item
   */
  async syncItem(item) {
    try {
      let result = null

      switch (item.action) {
        case 'create_paciente':
          result = await pacientesAPI.criar(item.data)
          break

        case 'create_ficha':
          result = await fichasAPI.criar(item.data)
          break

        case 'upload_image':
          const formData = new FormData()
          formData.append(item.metadata.fieldName || 'file', item.data)
          result = await api.post(
            item.metadata.endpoint || '/api/upload',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          break

        default:
          throw new Error(`Unknown sync action: ${item.action}`)
      }

      // Mark as synced
      item.status = 'synced'
      item.synced_at = new Date().toISOString()
      item.result = result.data
      await syncQueueStore.setItem(item.id, item)

      console.log(`✅ Synced: ${item.action}`)
      this.notifyListeners({
        type: 'sync_success',
        message: `Synced ${item.action}`,
        item
      })

      return { success: true, result: result.data }

    } catch (error) {
      // Update error info
      item.retry_count = (item.retry_count || 0) + 1
      item.last_error = error.message
      item.last_retry = new Date().toISOString()

      // Mark as error if too many retries
      if (item.retry_count >= 3) {
        item.status = 'error'
      }

      await syncQueueStore.setItem(item.id, item)

      console.error(`❌ Sync failed for ${item.action}:`, error.message)
      this.notifyListeners({
        type: 'sync_error',
        message: `Failed to sync ${item.action}`,
        item,
        error: error.message
      })

      return { success: false, error: error.message }
    }
  }

  /**
   * Sync all pending items
   */
  async syncAll() {
    if (!this.isOnline) {
      console.log('📡 Cannot sync while offline')
      return { success: false, message: 'Device is offline' }
    }

    if (this.isSyncing) {
      console.log('🔄 Sync already in progress')
      return { success: false, message: 'Sync already in progress' }
    }

    this.isSyncing = true
    this.notifyListeners({ type: 'sync_start', message: 'Starting synchronization' })

    try {
      const pendingItems = await this.getPendingSyncItems()

      if (pendingItems.length === 0) {
        console.log('✅ No items to sync')
        this.notifyListeners({ type: 'sync_complete', message: 'Nothing to sync', count: 0 })
        return { success: true, count: 0 }
      }

      console.log(`🔄 Syncing ${pendingItems.length} items...`)

      let successCount = 0
      let failCount = 0

      for (const item of pendingItems) {
        const result = await this.syncItem(item)
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      const message = `Sync complete: ${successCount} success, ${failCount} failed`
      console.log(`✅ ${message}`)

      this.notifyListeners({
        type: 'sync_complete',
        message,
        successCount,
        failCount,
        total: pendingItems.length
      })

      return {
        success: true,
        successCount,
        failCount,
        total: pendingItems.length
      }

    } catch (error) {
      console.error('❌ Sync error:', error)
      this.notifyListeners({
        type: 'sync_error',
        message: 'Sync failed',
        error: error.message
      })

      return { success: false, error: error.message }

    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Clear synced items from queue
   */
  async clearSyncedItems() {
    const keysToRemove = []

    await syncQueueStore.iterate((value, key) => {
      if (value.status === 'synced') {
        keysToRemove.push(key)
      }
    })

    for (const key of keysToRemove) {
      await syncQueueStore.removeItem(key)
    }

    console.log(`🧹 Cleared ${keysToRemove.length} synced items`)
    return keysToRemove.length
  }

  /**
   * Retry failed items
   */
  async retryFailedItems() {
    const items = []

    await syncQueueStore.iterate((value) => {
      if (value.status === 'error') {
        // Reset status to pending
        value.status = 'pending'
        items.push(value)
      }
    })

    // Update all items
    for (const item of items) {
      await syncQueueStore.setItem(item.id, item)
    }

    console.log(`🔄 Reset ${items.length} failed items to retry`)

    // Trigger sync
    if (this.isOnline && items.length > 0) {
      await this.syncAll()
    }

    return items.length
  }

  /**
   * Clear all sync data (use with caution!)
   */
  async clearAll() {
    await syncQueueStore.clear()
    await offlineStore.clear()
    console.log('🗑️ All sync data cleared')
  }

  /**
   * Get sync statistics
   */
  async getStats() {
    const stats = {
      pending: 0,
      synced: 0,
      error: 0,
      total: 0
    }

    await syncQueueStore.iterate((value) => {
      stats.total++
      if (value.status === 'pending') stats.pending++
      else if (value.status === 'synced') stats.synced++
      else if (value.status === 'error') stats.error++
    })

    return stats
  }
}

// Export singleton instance
export const syncService = new SyncService()
export default syncService
