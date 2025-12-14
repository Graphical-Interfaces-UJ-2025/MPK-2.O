<script setup>
import { useInfoStore } from '@/stores/infoPopUp';
const infoStore = useInfoStore();

const emit = defineEmits(['close']);

const close = () => {
  infoStore.visible = false;
  document.body.classList.remove('disable-scroll');
  emit('close');
};
infoStore.$subscribe((mutation, state) => {
  if (state.visible) {
    document.body.classList.add('disable-scroll');
  }
});
</script>

<template>
  <div v-if="infoStore.visible" class="info-pop-up">
    <div class="info-pop-up-content">
      <header>
        <div class="info">
          <h1>
            <i :class="infoStore.icon" v-if="infoStore.icon"></i>
            {{ infoStore.title }}
          </h1>
          <span v-if="infoStore.description">{{ infoStore.description }}</span>
        </div>
        <i class="fa-solid fa-xmark" @click="close"></i>
      </header>
      <component class="component" :is="infoStore.component" :data="infoStore.componentData" />
    </div>
  </div>
</template>

<style scoped>
.info-pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.info-pop-up-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-primary);
  padding: 15px;
  text-align: center;
  gap: 20px;
  overflow: auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

header h1 {
  display: flex;
  align-items: center;
  color: var(--text-main);
  gap: 10px;
  font-size: 35px;
  height: 40px;
  padding: 0;
  margin: 0;
}

.info {
  display: flex;
  flex-direction: column;
}

.info span {
  color: var(--text-additional);
  text-align: left;
}

header i {
  display: flex;
  align-items: center;
  font-size: 30px;
  height: 40px;
  margin-right: 10px;
}

header i[class='fa-solid fa-xmark'] {
  cursor: pointer;
  font-size: 30px;
  width: 20px;
  height: 20px;
}

header i[class='fa-solid fa-xmark']:hover {
  color: var(--text-negative);
  transform: scale(1.1) rotate(-90deg);
}

.component {
  width: 100%;
  min-height: 40vh;
  height: 100%;
}

@media (min-width: 768px) {
  .info-pop-up-content {
    width: 70vw;
    min-height: 50vh;
    border-radius: 10px;
  }
}

@media (max-width: 767px) {
  .info-pop-up-content {
    width: 100%;
    height: 100%;
  }
}
</style>
