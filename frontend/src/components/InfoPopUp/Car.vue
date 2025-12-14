<script setup>
defineProps({
  data: Object,
});
</script>

<template>
  <div class="car-details">
    <div class="car-gallery">
      <div class="main-image">
        <img :src="data.img.src" :alt="data.img.alt" />
      </div>
      <div class="thumbnails" v-if="data.gallery && data.gallery.length">
        <div v-for="(image, index) in data.gallery" :key="index" class="thumbnail">
          <img :src="image.src" :alt="image.alt || 'Car image'" />
        </div>
      </div>
    </div>

    <div class="car-info">
      <div class="car-specs">
        <div class="spec-item">
          <i class="fa-solid fa-calendar"></i>
          <span>Rok produkcji: {{ data.year || 'Nie podano' }}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-gauge-high"></i>
          <span>Przebieg: {{ data.mileage || 'Nie podano' }} km</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-gas-pump"></i>
          <span>Paliwo: {{ data.fuel || 'Nie podano' }}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-car"></i>
          <span>Nadwozie: {{ data.bodyType || 'Nie podano' }}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-gears"></i>
          <span>Skrzynia biegów: {{ data.transmission || 'Nie podano' }}</span>
        </div>
        <div class="spec-item">
          <i class="fa-solid fa-horse"></i>
          <span>Moc: {{ data.power || 'Nie podano' }} KM</span>
        </div>
      </div>

      <div class="car-description">
        <h3>Opis</h3>
        <p>{{ data.description || 'Brak opisu pojazdu.' }}</p>
      </div>

      <div class="car-features" v-if="data.features && data.features.length">
        <h3>Wyposażenie</h3>
        <ul>
          <li v-for="(feature, index) in data.features" :key="index">
            <i class="fa-solid fa-check"></i>
            {{ feature }}
          </li>
        </ul>
      </div>

      <div class="car-price">
        <div class="rating-tag">
          <i class="fa-solid fa-star"></i>
          <span class="price-value">{{ data.rating || 'Nie podano' }}</span>
        </div>
        <button class="purchase-btn">
          <i class="fa-solid fa-shopping-cart"></i>
          Zamów
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding: 5vh 0;
}

.car-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
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
}

.thumbnail:hover {
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.car-specs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  background-color: var(--background-secondary);
  padding: 20px;
  border-radius: 10px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spec-item i {
  color: var(--background-main);
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.car-description {
  text-align: left;
}

.car-description h3,
.car-features h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.car-description p {
  line-height: 1.6;
  color: var(--text-additional);
}

.car-features ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  list-style-type: none;
  padding: 0;
}

.car-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.car-features li i {
  color: var(--text-positive);
}

.car-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-secondary);
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
}

.rating-tag {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.rating-tag i {
  color: #f1c40f;
  font-size: 22px;
  margin-right: 5px;
}

.price-label {
  font-size: 16px;
  color: var(--text-additional);
}

.price-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
}

.purchase-btn {
  background-color: var(--background-main);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.purchase-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .car-details {
    flex-direction: row;
    align-items: flex-start;
  }

  .car-gallery {
    flex: 1;
    max-width: 50%;
  }

  .car-info {
    flex: 1;
    padding-left: 30px;
  }
}

@media (max-width: 767px) {
  .car-price {
    flex-direction: column;
    gap: 15px;
  }

  .price-tag {
    margin-bottom: 10px;
  }

  .purchase-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
