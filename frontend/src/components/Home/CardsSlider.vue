<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue';

const emit = defineEmits(['click']);

const props = defineProps({
  data: Array,
  sectionTitle: String,
  autoplay: {
    type: Boolean,
    default: true,
  },
  autoplaySpeed: {
    type: Number,
    default: 5000,
  },
});

const slidePosition = ref(0);
const slideWidth = ref(0);
const cardMargin = 30; // 15px on each side
const cardsContainer = ref(null);
const cardsWrapper = ref(null);
const isDragging = ref(false);
const startPos = ref(0);
const currentTranslate = ref(0);
const prevTranslate = ref(0);
const animationID = ref(null);
const currentIndex = ref(0);
const autoplayTimer = ref(null);
const isTransitioning = ref(false);

// Use original data without clones since we're removing infinite loop
const circularData = computed(() => {
  if (!props.data || props.data.length === 0) return [];
  // Return original data without clones
  return props.data;
});

const totalSlides = computed(() => {
  return circularData.value.length - 3;
});

const updateSlideWidth = () => {
  if (cardsContainer.value) {
    const containerWidth = cardsContainer.value.offsetWidth;
    const visibleCards =
      window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;
    // Calculate exact card width - subtract margins to ensure proper fit
    // We need to account for the margins between cards
    slideWidth.value = Math.floor(containerWidth / visibleCards);
  }
};

const setPositionByIndex = () => {
  if (!cardsContainer.value) return;

  // No offset needed since we're not using clones
  const offset = 0;

  // Get the actual card width from the DOM to ensure accuracy
  const cardElements = document.querySelectorAll('.card');
  if (cardElements.length > 0) {
    // Get the actual width including margin
    const cardRect = cardElements[0].getBoundingClientRect();
    const actualCardWidth = cardRect.width + cardMargin; // Add the total margin (left + right)

    // Use the actual measured width for precise positioning
    currentTranslate.value = (currentIndex.value + offset) * -actualCardWidth;
  } else {
    // Fallback to calculated width if DOM elements aren't ready
    currentTranslate.value = (currentIndex.value + offset) * -slideWidth.value;
  }

  prevTranslate.value = currentTranslate.value;
  setSliderPosition();
};

const setSliderPosition = () => {
  if (cardsContainer.value) {
    slidePosition.value = currentTranslate.value;
  }
};

function nextSlide() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

  // Only advance if not at the second-to-last slide
  if (currentIndex.value < totalSlides.value) {
    currentIndex.value++;
    setPositionByIndex();
  } else {
    currentIndex.value = 0;
    setPositionByIndex();
  }

  setTimeout(() => {
    isTransitioning.value = false;
  }, 300);
  resetAutoplay();
}

function prevSlide() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

  if (currentIndex.value > 0) {
    currentIndex.value--;
    setPositionByIndex();
  } else {
    currentIndex.value = totalSlides.value;
    setPositionByIndex();
  }

  setTimeout(() => {
    isTransitioning.value = false;
  }, 300);
  resetAutoplay();
}

function goToSlide(index) {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

  // Only allow navigation up to the second-to-last slide
  if (index <= totalSlides.value) {
    currentIndex.value = index;
    setPositionByIndex();
    resetAutoplay();
  }

  setTimeout(() => {
    isTransitioning.value = false;
  }, 300);
}

// Touch events handlers
function touchStart(event) {
  if (animationID.value) {
    cancelAnimationFrame(animationID.value);
  }
  startPos.value = getPositionX(event);
  isDragging.value = true;
  animationID.value = requestAnimationFrame(animation);
}

function touchMove(event) {
  if (isDragging.value) {
    const currentPosition = getPositionX(event);
    // Apply movement without rounding to ensure smooth dragging
    currentTranslate.value =
      prevTranslate.value + currentPosition - startPos.value;
  }
}

function touchEnd() {
  isDragging.value = false;
  cancelAnimationFrame(animationID.value);

  const movedBy = currentTranslate.value - prevTranslate.value;

  // Get the actual card width for accurate threshold calculation
  const cardElements = document.querySelectorAll('.card');
  let actualCardWidth = slideWidth.value;

  if (cardElements.length > 0) {
    const cardRect = cardElements[0].getBoundingClientRect();
    actualCardWidth = cardRect.width + cardMargin;
  }

  // If moved enough negative, next slide
  if (movedBy < -actualCardWidth / 4) {
    nextSlide();
  }
  // If moved enough positive, prev slide
  else if (movedBy > actualCardWidth / 4) {
    prevSlide();
  } else {
    // Not enough movement, snap back
    setPositionByIndex();
  }
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPosition();
  if (isDragging.value) {
    animationID.value = requestAnimationFrame(animation);
  }
}

function startAutoplay() {
  if (props.autoplay && totalSlides.value > 1) {
    autoplayTimer.value = setInterval(() => {
      nextSlide();
    }, props.autoplaySpeed);
  }
}

function resetAutoplay() {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    startAutoplay();
  }
}

onMounted(() => {
  // Wait for the DOM to be fully rendered
  nextTick(() => {
    updateSlideWidth();

    // Wait for the width calculation to be applied
    nextTick(() => {
      setPositionByIndex();

      // Force a second update after DOM is fully rendered
      setTimeout(() => {
        updateSlideWidth();
        setPositionByIndex();
        startAutoplay();

        // Final adjustment after all images are loaded
        window.addEventListener('load', () => {
          updateSlideWidth();
          setPositionByIndex();
        });
      }, 100);
    });
  });

  window.addEventListener('resize', () => {
    updateSlideWidth();
    nextTick(() => {
      setPositionByIndex();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSlideWidth);
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
  }
  if (animationID.value) {
    cancelAnimationFrame(animationID.value);
  }
});

function click(data) {
  emit('click', data);
}
</script>

<template>
  <div class="cards-carousel">
    <h2 class="section-title" v-if="props.sectionTitle">
      {{ props.sectionTitle }}
    </h2>

    <div class="carousel-container">
      <button class="nav-button prev" @click="prevSlide" :disabled="totalSlides <= 1">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="cards-container" ref="cardsContainer" @mousedown="touchStart" @touchstart="touchStart"
        @mouseup="touchEnd" @touchend="touchEnd" @mouseleave="touchEnd" @mousemove="touchMove" @touchmove="touchMove">
        <div class="cards-wrapper" ref="cardsWrapper" :style="{ transform: `translateX(${slidePosition}px)` }">
          <article v-for="(card, index) in circularData" :key="index" class="card"
            :style="{ width: slideWidth - cardMargin + 'px' }">
            <div class="card-image">
              <img :src="card.img.src" :alt="card.img.alt" />
            </div>
            <div class="card-content">
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
              <div class="card-footer" v-if="card.price">
                <span v-if="card.price" class="price">{{ card.price }}</span>
              </div>
              <button class="view-details-btn" @click="click(card)">
                Zobacz więcej
              </button>
            </div>
          </article>
        </div>
      </div>

      <button class="nav-button next" @click="nextSlide">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>

    <div class="pagination">
      <span v-for="(_, index) in props.data.slice(0, props.data.length - 2)" :key="index" :class="{
        active: index === currentIndex,
        disabled: index > totalSlides.value,
      }" @click="goToSlide(index)"></span>
    </div>
  </div>
</template>

<style scoped>
.cards-carousel {
  width: 100%;
  padding: 40px 1%;
  position: relative;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: var(--text-primary);
  text-align: center;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.cards-container {
  width: 100%;
  overflow: hidden;
  padding: 10px 0;
  cursor: grab;
  user-select: none;
}

.cards-container:active {
  cursor: grabbing;
}

.cards-wrapper {
  display: flex;
  padding: 10px 0px;
  width: max-content;
  transition: transform 0.3s ease-out;
  /* Ensure cards are properly aligned */
  align-items: stretch;
  gap: 0;
  /* Remove any gap between cards */
}

.card {
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0 15px;
  min-height: 450px;
  background-color: var(--background-secondary);
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* Ensure consistent sizing */
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s ease;
}

.card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.card p {
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-additional);
  margin-bottom: 15px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #2ecc71;
}

.view-details-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--background-main);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.view-details-btn:hover {
  background-color: var(--background-main);
  transform: none;
}

.nav-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--background-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: var(--text-main);
  margin: 5px 5px;
}

.nav-button:hover {
  transform: scale(1.1);
  background-color: var(--background-main);
  color: white;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--text-secondary-lighter, #ccc);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination span.active {
  background-color: var(--background-main);
  transform: scale(1.2);
}

.pagination span.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Slider transitions */
.slide-transition {
  transition: transform 0.5s ease;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .card {
    width: calc(50% - 15px);
  }
}

@media (max-width: 768px) {
  .cards-wrapper {
    gap: 20px;
  }

  .card {
    width: 100%;
    height: auto;
    min-height: 400px;
  }

  .nav-button.prev {
    left: -15px;
  }

  .nav-button.next {
    right: -15px;
  }
}
</style>
