<script setup>
defineProps({
  data: Object,
});
</script>

<template>
  <div class="communication-details">
    <div class="communication-header">
      <div class="header-icon" v-if="data.icon">
        <i :class="data.icon"></i>
      </div>
      <div class="header-content">
        <h2>{{ data.title || 'Komunikat' }}</h2>
        <p class="communication-type" v-if="data.type">{{ data.type }}</p>
      </div>
    </div>

    <div class="communication-media" v-if="data.img">
      <div class="main-image">
        <img :src="data.img.src" :alt="data.img.alt" />
      </div>
      <div class="thumbnails" v-if="data.gallery && data.gallery.length">
        <div v-for="(image, index) in data.gallery" :key="index" class="thumbnail">
          <img :src="image.src" :alt="image.alt || 'Media'" />
        </div>
      </div>
    </div>

    <div class="communication-content">
      <div class="content-section">
        <div class="communication-body">
          <h3>Szczegóły</h3>
          <p>{{ data.description || 'Brak szczegółów.' }}</p>
        </div>

        <div class="communication-meta" v-if="data.metadata && Object.keys(data.metadata).length">
          <h3>Informacje dodatkowe</h3>
          <div class="meta-grid">
            <div v-for="(value, key) in data.metadata" :key="key" class="meta-item">
              <span class="meta-label">{{ key }}:</span>
              <span class="meta-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="communication-tags" v-if="data.tags && data.tags.length">
          <h3>Tagi</h3>
          <div class="tags-container">
            <span v-for="(tag, index) in data.tags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="communication-footer">
        <div class="status-info" v-if="data.status">
          <span class="status-badge" :class="'status-' + data.status.toLowerCase()">
            {{ data.status }}
          </span>
        </div>
        <div class="action-buttons" v-if="data.actions && data.actions.length">
          <button v-for="(action, index) in data.actions" :key="index" class="action-btn"
            :class="'action-' + action.type">
            <i v-if="action.icon" :class="action.icon"></i>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.communication-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  padding: 5vh 0;
}

.communication-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: var(--background-secondary);
  border-radius: 10px;
  border-left: 4px solid var(--background-main);
}

.header-icon {
  font-size: 28px;
  color: var(--background-main);
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.header-content h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-main);
}

.communication-type {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: var(--text-additional);
}

.communication-media {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  max-height: 400px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail {
  width: 100px;
  height: 70px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.thumbnail:hover {
  transform: scale(1.05);
  border-color: var(--background-main);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.communication-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.communication-body {
  text-align: left;
}

.communication-body h3,
.communication-meta h3,
.communication-tags h3 {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.communication-body p {
  line-height: 1.6;
  color: var(--text-additional);
  margin: 0;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  background-color: var(--background-secondary);
  padding: 15px;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: var(--text-additional);
  font-weight: 600;
  text-transform: uppercase;
}

.meta-value {
  font-size: 14px;
  color: var(--text-main);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  background-color: var(--background-main);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.communication-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  border-top: 1px solid var(--border-color);
}

.status-info {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-success {
  background-color: #2ecc71;
  color: white;
}

.status-warning {
  background-color: #f39c12;
  color: white;
}

.status-error {
  background-color: #e74c3c;
  color: white;
}

.status-info {
  background-color: #3498db;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  background-color: var(--background-main);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-primary {
  background-color: var(--background-main);
}

.action-secondary {
  background-color: var(--text-additional);
}

.action-danger {
  background-color: #e74c3c;
}

@media (min-width: 768px) {
  .communication-details {
    flex-direction: row;
    align-items: flex-start;
  }

  .communication-media {
    flex: 0 0 45%;
  }

  .communication-content {
    flex: 1;
    padding-left: 20px;
  }

  .communication-footer {
    flex-direction: row;
  }
}

@media (max-width: 767px) {
  .communication-footer {
    flex-direction: column;
  }

  .action-buttons {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
