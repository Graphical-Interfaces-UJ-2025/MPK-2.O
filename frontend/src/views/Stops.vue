<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const searchQuery = ref('');

const stops = ref([
  { id: 1, name: 'Dworzec Glowny', latitude: 50.0647, longitude: 19.9450, lines: ['4', '10', '13', '52', '100', '124', '192'] },
  { id: 2, name: 'Rynek Glowny', latitude: 50.0619, longitude: 19.9372, lines: ['1', '8', '13', '18'] },
  { id: 3, name: 'Plac Wszystkich Swietych', latitude: 50.0575, longitude: 19.9367, lines: ['1', '8', '18', '50'] },
  { id: 4, name: 'Wawel', latitude: 50.0540, longitude: 19.9355, lines: ['1', '8', '10', '18'] },
  { id: 5, name: 'Jubilat', latitude: 50.0523, longitude: 19.9412, lines: ['8', '10', '13', '50', '139'] },
  { id: 6, name: 'Rondo Grzegorzeckie', latitude: 50.0589, longitude: 19.9567, lines: ['1', '4', '10', '144', '152'] },
  { id: 7, name: 'Rondo Mogilskie', latitude: 50.0686, longitude: 19.9556, lines: ['1', '4', '10', '152', '192'] },
  { id: 8, name: 'Plac Inwalidow', latitude: 50.0725, longitude: 19.9289, lines: ['4', '8', '13', '124', '159'] },
  { id: 9, name: 'Bronowice', latitude: 50.0789, longitude: 19.9012, lines: ['4', '8', '13', '173'] },
  { id: 10, name: 'Krowodrza Gorka', latitude: 50.0823, longitude: 19.9156, lines: ['18', '50'] },
  { id: 11, name: 'Czerwone Maki', latitude: 50.0312, longitude: 19.9089, lines: ['18', '52', '159'] },
  { id: 12, name: 'Kurdwanow', latitude: 50.0123, longitude: 19.9678, lines: ['50', '139'] },
  { id: 13, name: 'Nowy Biezanow', latitude: 50.0089, longitude: 19.9912, lines: ['13', '144'] },
  { id: 14, name: 'Pleszow', latitude: 50.0756, longitude: 20.0234, lines: ['10', '152'] },
  { id: 15, name: 'Salwator', latitude: 50.0612, longitude: 19.9112, lines: ['1'] },
  { id: 16, name: 'Wzgorza Krzeslawickie', latitude: 50.0923, longitude: 20.0345, lines: ['1'] },
  { id: 17, name: 'Lagiewniki', latitude: 50.0234, longitude: 19.9345, lines: ['10', '139'] },
  { id: 18, name: 'Borek Falecki', latitude: 50.0156, longitude: 19.9234, lines: ['8'] },
  { id: 19, name: 'Walcownia', latitude: 50.0678, longitude: 20.0123, lines: ['4'] },
  { id: 20, name: 'Balice Lotnisko', latitude: 50.0778, longitude: 19.7856, lines: ['100', '173'] },
  { id: 21, name: 'Os. Podwawelskie', latitude: 50.0412, longitude: 19.9278, lines: ['124', '159'] },
  { id: 22, name: 'Wieliczka', latitude: 49.9867, longitude: 20.0645, lines: ['144'] },
  { id: 23, name: 'Nowa Huta', latitude: 50.0723, longitude: 20.0378, lines: ['192', '152'] },
  { id: 24, name: 'Skawina', latitude: 49.9756, longitude: 19.8234, lines: ['159'] },
]);

const filteredStops = computed(() => {
  if (!searchQuery.value) return stops.value;
  return stops.value.filter(stop =>
    stop.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    stop.lines.some(line => line.includes(searchQuery.value))
  );
});

const getLineColor = (lineNumber) => {
  const colors = {
    '1': '#e74c3c', '4': '#3498db', '8': '#2ecc71', '10': '#9b59b6',
    '13': '#f39c12', '18': '#1abc9c', '50': '#e91e63', '52': '#00bcd4',
    '100': '#607d8b', '124': '#795548', '139': '#ff5722', '144': '#4caf50',
    '152': '#673ab7', '159': '#009688', '173': '#ff9800', '192': '#8bc34a'
  };
  return colors[lineNumber] || '#666';
};

const goToSchedule = (stopName) => {
  router.push({
    path: '/schedule',
    query: { stop: stopName },
  });
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Przystanki</h1>
        <p class="subtitle">Znajdz przystanek i sprawdz dostepne linie</p>
      </div>

      <!-- Search -->
      <div class="search-section">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Szukaj przystanku lub numeru linii..."
          />
        </div>
        <div class="results-count">
          <i class="fa-solid fa-location-dot"></i>
          Znaleziono: <strong>{{ filteredStops.length }}</strong> przystankow
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ladowanie przystankow...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredStops.length === 0" class="empty-state">
        <i class="fa-solid fa-map-marker-alt"></i>
        <p>Nie znaleziono przystankow</p>
      </div>

      <!-- Stops grid -->
      <div v-else class="stops-grid">
        <div
          v-for="stop in filteredStops"
          :key="stop.id"
          class="stop-card"
        >
          <div class="stop-header">
            <div class="stop-icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="stop-name">{{ stop.name }}</div>
          </div>

          <div class="stop-coordinates">
            <i class="fa-solid fa-map"></i>
            <span>{{ stop.latitude.toFixed(4) }}, {{ stop.longitude.toFixed(4) }}</span>
          </div>

          <div class="stop-lines">
            <span class="lines-label">Linie:</span>
            <div class="lines-list">
              <span
                v-for="line in stop.lines"
                :key="line"
                class="line-badge"
                :style="{ backgroundColor: getLineColor(line) }"
              >
                {{ line }}
              </span>
            </div>
          </div>

          <button class="stop-details-btn" @click="goToSchedule(stop.name)">
            <i class="fa-solid fa-clock"></i>
            Rozklad jazdy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  background-color: var(--background-primary);
  padding: 40px 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--text-additional);
  font-size: 16px;
  margin: 0;
}

.search-section {
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-additional);
}

.search-box input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  font-size: 16px;
  background: var(--card-background);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.1);
}

.results-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-additional);
  font-size: 14px;
}

.results-count i {
  color: var(--background-main);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-additional);
}

.loading-state i,
.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-state i {
  color: var(--background-main);
}

.stops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.stop-card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: all 0.3s ease;
}

.stop-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.stop-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.stop-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-main);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 20px;
}

.stop-name {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.stop-coordinates {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--background-tertiary);
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--text-additional);
}

.stop-coordinates i {
  color: var(--background-main);
}

.stop-lines {
  margin-bottom: 16px;
}

.lines-label {
  display: block;
  font-size: 12px;
  color: var(--text-additional);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lines-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.line-badge {
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
}

.stop-details-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stop-details-btn:hover {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .stops-grid {
    grid-template-columns: 1fr;
  }
}
</style>
