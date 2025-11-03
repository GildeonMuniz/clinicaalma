<template>
  <div v-if="showInstallButton" class="install-pwa-container">
    <div class="install-pwa-prompt">
      <div class="install-content">
        <svg class="install-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <div class="install-text">
          <h3>Instalar Clínica Alma</h3>
          <p>Instale o app para acesso rápido e uso offline</p>
        </div>
      </div>
      <div class="install-actions">
        <button @click="installPWA" class="btn-install">Instalar Agora</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstallPWA',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false
    }
  },
  mounted() {
    // Verificar se já está instalado (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.showInstallButton = false
      return
    }

    // Capturar o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir o prompt automático do Chrome
      e.preventDefault()
      // Armazenar o evento para usar depois
      this.deferredPrompt = e
      // Mostrar o botão de instalação personalizado SEMPRE
      this.showInstallButton = true
    })

    // Escutar o evento de instalação bem-sucedida
    window.addEventListener('appinstalled', () => {
      console.log('PWA foi instalado com sucesso')
      this.showInstallButton = false
      this.deferredPrompt = null
    })
  },
  methods: {
    async installPWA() {
      if (!this.deferredPrompt) {
        return
      }

      // Mostrar o prompt de instalação
      this.deferredPrompt.prompt()

      // Aguardar a escolha do usuário
      const { outcome } = await this.deferredPrompt.userChoice
      console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`)

      // Se o usuário recusou, manter o prompt visível para próxima vez
      if (outcome === 'dismissed') {
        // O banner continuará aparecendo nas próximas visitas
        console.log('Banner de instalação continuará aparecendo nas próximas visitas')
      } else {
        // Se aceitou, ocultar o banner
        this.deferredPrompt = null
        this.showInstallButton = false
      }
    }
  }
}
</script>

<style scoped>
.install-pwa-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.install-pwa-prompt {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 1rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 16px 16px 0 0;
  margin: 0;
}

.install-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.install-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 12px;
}

.install-text h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.install-text p {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.95;
}

.install-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-dismiss,
.btn-install {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-dismiss {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-dismiss:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-install {
  background: white;
  color: #6366f1;
  font-weight: 600;
}

.btn-install:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-install:active {
  transform: translateY(0);
}

/* Responsividade para desktop */
@media (min-width: 768px) {
  .install-pwa-prompt {
    max-width: 500px;
    margin: 0 auto 1rem;
    border-radius: 16px;
  }

  .install-pwa-container {
    bottom: 1rem;
    left: 1rem;
    right: auto;
  }
}
</style>
