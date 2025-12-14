<script setup>
defineProps({
  src: String,
  title: String,
  description: String,
  isImage: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <section>
    <div class="video-desc">
      <h1>{{ title }}</h1>
      <span>{{ description }}</span>
    </div>
    <div class="video-overlay">
      <iframe v-if="!isImage" :src="src" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <img v-else :src="src" loading="lazy" />
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 40px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 100%;
  overflow: hidden;
}

.video-desc {
  width: 100%;
  max-width: 600px;
  margin: 0;
  padding: 0 10px;
}

.video-desc h1 {
  color: var(--text-primary);
  margin-top: 0;
  padding-top: 0;
  font-size: clamp(32px, 5vw, 45px);
  font-weight: 600;
}

.video-desc span {
  color: var(--text-primary);
  display: inline-block;
  font-size: clamp(16px, 3vw, 20px);
  line-height: 1.5;
}

.video-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
}

.video-overlay iframe {
  aspect-ratio: 16/9;
}

.video-overlay img {
  width: 100%;
}

.video-overlay iframe,
.video-overlay img {
  border-radius: 10px;
  box-shadow: 0 0 10px var(--header-shadow);
}

@media (min-width: 800px) {
  .video-overlay iframe {
    width: 560px;
    height: 315px;
  }
}

@media (max-width: 700px) {
  .video-overlay iframe {
    width: 480px;
    height: 270px;
  }
}

@media (max-width: 500px) {
  .video-overlay iframe {
    width: 400px;
    height: 225px;
  }
}
</style>
