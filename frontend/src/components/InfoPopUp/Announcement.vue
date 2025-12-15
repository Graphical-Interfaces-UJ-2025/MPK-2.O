<script setup>
defineProps({
  data: Object,
});
</script>

<template>
  <div class="announcement">
    <div class="announcement-header">
      <div class="header-icon" v-if="data.icon">
        <i :class="data.icon"></i>
      </div>
      <div class="header-content">
        <h2>{{ data.title || 'Komunikat' }}</h2>
        <span v-if="data.status" class="status-badge" :class="'status-' + data.status.toLowerCase()">
          {{ data.status }}
        </span>
      </div>
    </div>

    <div class="announcement-body">
      <img v-if="data.img" :src="data.img.src" :alt="data.img.alt" class="announcement-image" />

      <div class="announcement-content">
        <p class="announcement-description">{{ data.description }}</p>

        <div v-if="data.metadata && Object.keys(data.metadata).length" class="metadata-inline">
          <span v-for="(value, key) in data.metadata" :key="key" class="meta-item">
            <strong>{{ key }}:</strong> {{ value }}
          </span>
        </div>

        <div v-if="data.tags && data.tags.length" class="tags">
          <span v-for="(tag, index) in data.tags" :key="index" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div v-if="data.actions && data.actions.length" class="announcement-actions">
      <button v-for="(action, index) in data.actions" :key="index" class="action-btn" :class="'action-' + action.type">
        <i v-if="action.icon" :class="action.icon"></i>
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.announcement {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px 0;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.header-icon {
  font-size: 32px;
  color: var(--background-main);
  width: 45px;
  text-align: center;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-main);
  font-weight: 700;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-error {
  background-color: #f8d7da;
  color: #721c24;
}

.status-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.announcement-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-image {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
}

.announcement-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.announcement-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-additional);
  margin: 0;
}

.metadata-inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--background-secondary);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-additional);
}

.meta-item {
  display: flex;
  gap: 6px;
}

.meta-item strong {
  color: var(--text-main);
  min-width: 120px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 5px;
}

.tag {
  display: inline-block;
  background-color: var(--background-main);
  color: white;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
}

.announcement-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  padding: 9px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.action-primary {
  background-color: var(--background-main);
  color: white;
}

.action-primary:hover {
  opacity: 0.9;
}

.action-secondary {
  background-color: var(--background-secondary);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.action-secondary:hover {
  background-color: var(--border-color);
}

.action-danger {
  background-color: #e74c3c;
  color: white;
}

.action-danger:hover {
  opacity: 0.9;
}

@media (max-width: 480px) {
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .announcement-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .metadata-inline {
    font-size: 12px;
  }

  .meta-item strong {
    min-width: auto;
  }
}
</style>
