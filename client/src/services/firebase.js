/**
 * Firebase Configuration - FIRESTORE ONLY (Sem Storage)
 * Esta versão NÃO requer upgrade de plano!
 * Armazena imagens como Base64 no Firestore
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, getDocs, getDoc, query, where, updateDoc, doc } from 'firebase/firestore'

// Firebase configuration - IMPORTANTE: Substitua com suas credenciais do Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "CONFIGURE_NO_.ENV",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clinica-alma.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "clinica-alma",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "clinica-alma.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
}

// Initialize Firebase
let app = null
let db = null

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)

  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Firebase offline persistence enabled (Firestore only)')
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.')
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ The current browser does not support offline persistence')
      }
    })
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
}

// Collection references
const COLLECTIONS = {
  PACIENTES: 'pacientes',
  FICHAS: 'fichas_atendimento',
  IMAGENS: 'imagens', // Nova coleção para armazenar imagens
  SYNC_QUEUE: 'sync_queue'
}

/**
 * Converter File/Blob para Base64
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Comprimir imagem se necessário (máximo 1MB para Firestore)
 */
async function compressImage(file, maxSizeKB = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Redimensionar se muito grande
        const MAX_WIDTH = 1920
        const MAX_HEIGHT = 1920

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Tentar várias qualidades até ficar < maxSizeKB
        let quality = 0.9
        let attempts = 0

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              const sizeKB = blob.size / 1024

              if (sizeKB <= maxSizeKB || quality <= 0.3 || attempts >= 5) {
                console.log(`📸 Imagem comprimida: ${sizeKB.toFixed(0)}KB (qualidade: ${(quality * 100).toFixed(0)}%)`)
                resolve(blob)
              } else {
                quality -= 0.1
                attempts++
                tryCompress()
              }
            },
            'image/jpeg',
            quality
          )
        }

        tryCompress()
      }

      img.onerror = reject
      img.src = e.target.result
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Firebase Service - FIRESTORE ONLY
 */
export const firebaseService = {
  // Check if Firebase is properly configured
  isConfigured() {
    return firebaseConfig.apiKey !== "CONFIGURE_NO_.ENV" && db !== null
  },

  // Pacientes
  async savePaciente(pacienteData) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const docRef = await addDoc(collection(db, COLLECTIONS.PACIENTES), {
      ...pacienteData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_to_server: false
    })
    return { id: docRef.id, ...pacienteData }
  },

  async getPacientes() {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PACIENTES))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  async getPacienteByCodigo(codigo) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const q = query(
      collection(db, COLLECTIONS.PACIENTES),
      where('codigo_consulente', '==', codigo)
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return null

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  },

  // Fichas
  async saveFicha(fichaData) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const docRef = await addDoc(collection(db, COLLECTIONS.FICHAS), {
      ...fichaData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_to_server: false
    })
    return { id: docRef.id, ...fichaData }
  },

  async getFichas(pacienteId) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const q = query(
      collection(db, COLLECTIONS.FICHAS),
      where('paciente_id', '==', pacienteId)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Imagens - Salvar como Base64 no Firestore (SEM Storage)
  async uploadImage(file, metadata = {}) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    try {
      // Comprimir imagem para caber no limite do Firestore (1MB)
      console.log(`📸 Comprimindo imagem: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`)
      const compressedBlob = await compressImage(file, 900) // 900KB max

      // Converter para Base64
      const base64 = await fileToBase64(compressedBlob)

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, COLLECTIONS.IMAGENS), {
        filename: file.name,
        data: base64, // Imagem em Base64
        size: compressedBlob.size,
        type: compressedBlob.type || 'image/jpeg',
        metadata: metadata,
        created_at: new Date().toISOString()
      })

      console.log(`✅ Imagem salva no Firestore: ${docRef.id} (${(compressedBlob.size / 1024).toFixed(0)}KB)`)

      return {
        id: docRef.id,
        url: base64, // Retornar Base64 diretamente
        path: `imagens/${docRef.id}`,
        filename: file.name
      }
    } catch (error) {
      console.error('❌ Erro ao salvar imagem:', error)
      throw error
    }
  },

  // Recuperar imagem do Firestore
  async getImage(imageId) {
    if (!this.isConfigured()) throw new Error('Firebase not configured')

    const docRef = doc(db, COLLECTIONS.IMAGENS, imageId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Image not found')
    }

    return docSnap.data()
  },

  // Sync Queue - Para sincronizar quando voltar online
  async addToSyncQueue(action, data) {
    if (!this.isConfigured()) return null

    const docRef = await addDoc(collection(db, COLLECTIONS.SYNC_QUEUE), {
      action, // 'create_paciente', 'create_ficha', 'upload_image'
      data,
      status: 'pending', // pending, syncing, synced, error
      created_at: new Date().toISOString(),
      retry_count: 0,
      last_error: null
    })
    return docRef.id
  },

  async getPendingSyncItems() {
    if (!this.isConfigured()) return []

    const q = query(
      collection(db, COLLECTIONS.SYNC_QUEUE),
      where('status', '==', 'pending')
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  async updateSyncItemStatus(id, status, error = null) {
    if (!this.isConfigured()) return

    const docRef = doc(db, COLLECTIONS.SYNC_QUEUE, id)
    await updateDoc(docRef, {
      status,
      updated_at: new Date().toISOString(),
      last_error: error
    })
  },

  async incrementSyncRetry(id) {
    if (!this.isConfigured()) return

    const docRef = doc(db, COLLECTIONS.SYNC_QUEUE, id)
    const currentDoc = await getDoc(docRef)
    const retryCount = (currentDoc.data()?.retry_count || 0) + 1

    await updateDoc(docRef, {
      retry_count: retryCount,
      updated_at: new Date().toISOString()
    })
  }
}

export { db, COLLECTIONS }
export default firebaseService
