<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  images: Array,
});

let slideIndex = ref(1);

onMounted(() => {
  const slides = document.getElementsByClassName('slide');

  for (let slide of slides) {
    const img = slide.querySelector('img');

    img.addEventListener('load', () => {
      slide.classList.remove('loading');
    });

    if (img.complete) {
      setTimeout(() => slide.classList.remove('loading'), 100);
    }
  }

  showSlides(slideIndex.value);
});


function changeSlide(n) {
  showSlides((slideIndex.value += n));
}

function currentSlide(n) {
  showSlides((slideIndex.value = n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName('slide');
  const dots = document.getElementsByClassName('dot');

  if (n > slides.length) slideIndex.value = 1;
  if (n < 1) slideIndex.value = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }

  slides[slideIndex.value - 1].style.display = 'block';
  dots[slideIndex.value - 1].className += ' active';
}
</script>

<template>
  <section>
    <div class="slideshow-container">
      <div v-for="(image, index) in images" :key="index" class="slide fade loading">
        <div class="loading-spinner"></div>
        <img :src="image.src" :alt="image.alt" />
        <div class="slide-caption">
          <p>{{ image.caption }}</p>
        </div>
      </div>

      <a class="prev" @click="changeSlide(-1)">&#10094;</a>
      <a class="next" @click="changeSlide(1)">&#10095;</a>
    </div>

    <div class="dots-container">
      <span v-for="(image, index) in images" :key="index" class="dot" @click="currentSlide(index + 1)"></span>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 20px 0;
}

.slideshow-container {
  width: 1000px;
  position: relative;
  margin: auto;
  aspect-ratio: 16/9;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 20px;
}

.slide {
  display: none;
  width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.3);
  user-select: none;
}

.next {
  right: 0;
}

.prev {
  left: 0;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.slide-caption {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: center;
}

.dots-container {
  text-align: center;
  padding: 1rem;
}

.dot {
  cursor: pointer;
  height: 12px;
  width: 12px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}

.active,
.dot:hover {
  background-color: #717171;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: none;
}

.loading-spinner:after {
  content: '';
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #fff;
  border-color: #000 transparent #000 transparent;
  animation: spinner 1.2s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.slide.loading img {
  opacity: 0;
}

.slide.loading .loading-spinner {
  display: block;
}
</style>
