<script setup>
import { ref, computed } from 'vue';

const isSearching = ref(false);
const hasSearched = ref(false);

const fromStop = ref('');
const toStop = ref('');
const departureTime = ref('');

const stops = [
  'Dworzec Glowny', 'Rynek Glowny', 'Plac Wszystkich Swietych', 'Wawel', 'Jubilat',
  'Rondo Grzegorzeckie', 'Rondo Mogilskie', 'Plac Inwalidow', 'Bronowice', 'Krowodrza Gorka',
  'Czerwone Maki', 'Kurdwanow', 'Nowy Biezanow', 'Pleszow', 'Salwator',
  'Wzgorza Krzeslawickie', 'Lagiewniki', 'Borek Falecki', 'Walcownia', 'Balice Lotnisko',
  'Os. Podwawelskie', 'Wieliczka', 'Nowa Huta', 'Skawina'
];

const routes = ref([]);

const mockRoutes = [
  {
    id: 1,
    duration: 18,
    transfers: 0,
    departureTime: '08:15',
    arrivalTime: '08:33',
    segments: [
      { type: 'tram', line: '4', from: 'Dworzec Glowny', to: 'Rondo Mogilskie', duration: 18, color: '#3498db' }
    ]
  },
  {
    id: 2,
    duration: 24,
    transfers: 1,
    departureTime: '08:20',
    arrivalTime: '08:44',
    segments: [
      { type: 'tram', line: '10', from: 'Dworzec Glowny', to: 'Rondo Grzegorzeckie', duration: 12, color: '#9b59b6' },
      { type: 'walk', duration: 3 },
      { type: 'tram', line: '1', from: 'Rondo Grzegorzeckie', to: 'Rondo Mogilskie', duration: 9, color: '#e74c3c' }
    ]
  },
  {
    id: 3,
    duration: 32,
    transfers: 1,
    departureTime: '08:25',
    arrivalTime: '08:57',
    segments: [
      { type: 'autobus', line: '192', from: 'Dworzec Glowny', to: 'Plac Inwalidow', duration: 15, color: '#8bc34a' },
      { type: 'walk', duration: 5 },
      { type: 'tram', line: '4', from: 'Plac Inwalidow', to: 'Rondo Mogilskie', duration: 12, color: '#3498db' }
    ]
  }
];

const swapStops = () => {
  const temp = fromStop.value;
  fromStop.value = toStop.value;
  toStop.value = temp;
};

const searchRoutes = () => {
  if (!fromStop.value || !toStop.value) return;

  isSearching.value = true;

  // Simulate API call
  setTimeout(() => {
    routes.value = mockRoutes;
    isSearching.value = false;
    hasSearched.value = true;
  }, 1000);
};

const canSearch = computed(() => fromStop.value && toStop.value && fromStop.value !== toStop.value);

const getSegmentIcon = (type) => {
  switch (type) {
    case 'tram': return 'fa-train-tram';
    case 'autobus': return 'fa-bus';
    case 'walk': return 'fa-person-walking';
    default: return 'fa-circle';
  }
};

const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};

// Initialize departure time to now
const now = new Date();
departureTime.value = now.toTimeString().slice(0, 5);
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Planer podrozy</h1>
        <p class="subtitle">Zaplanuj swoja trase komunikacja miejska</p>
      </div>

      <!-- Search form -->
      <div class="search-card">
        <div class="search-form">
          <div class="stops-inputs">
            <div class="input-group">
              <label>
                <i class="fa-solid fa-circle-dot from-icon"></i>
                Skad
              </label>
              <select v-model="fromStop">
                <option value="" disabled>Wybierz przystanek</option>
                <option v-for="stop in stops" :key="stop" :value="stop">{{ stop }}</option>
              </select>
            </div>

            <button class="swap-btn" @click="swapStops" :disabled="!fromStop && !toStop">
              <i class="fa-solid fa-arrows-up-down"></i>
            </button>

            <div class="input-group">
              <label>
                <i class="fa-solid fa-location-dot to-icon"></i>
                Dokad
              </label>
              <select v-model="toStop">
                <option value="" disabled>Wybierz przystanek</option>
                <option v-for="stop in stops" :key="stop" :value="stop">{{ stop }}</option>
              </select>
            </div>
          </div>

          <div class="time-input">
            <div class="input-group">
              <label>
                <i class="fa-solid fa-clock"></i>
                Godzina odjazdu
              </label>
              <input type="time" v-model="departureTime" />
            </div>
          </div>

          <button
            class="search-btn"
            @click="searchRoutes"
            :disabled="!canSearch || isSearching"
          >
            <i v-if="!isSearching" class="fa-solid fa-route"></i>
            <i v-else class="fa-solid fa-spinner fa-spin"></i>
            {{ isSearching ? 'Szukam...' : 'Szukaj polaczenia' }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isSearching" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Szukam najlepszych polaczen...</p>
      </div>

      <!-- Results -->
      <div v-else-if="hasSearched && routes.length > 0" class="results-section">
        <h2>
          <i class="fa-solid fa-list-check"></i>
          Znalezione polaczenia
        </h2>

        <div class="routes-list">
          <div v-for="route in routes" :key="route.id" class="route-card">
            <div class="route-header">
              <div class="route-times">
                <span class="departure">{{ route.departureTime }}</span>
                <div class="time-line">
                  <span class="duration-badge">{{ formatDuration(route.duration) }}</span>
                </div>
                <span class="arrival">{{ route.arrivalTime }}</span>
              </div>
              <div class="route-info">
                <span class="transfers">
                  <i class="fa-solid fa-repeat"></i>
                  {{ route.transfers === 0 ? 'Bezposredni' : `${route.transfers} przesiadka` }}
                </span>
              </div>
            </div>

            <div class="route-segments">
              <div
                v-for="(segment, index) in route.segments"
                :key="index"
                class="segment"
                :class="{ 'walk-segment': segment.type === 'walk' }"
              >
                <div class="segment-icon" :style="segment.color ? { backgroundColor: segment.color } : {}">
                  <i :class="['fa-solid', getSegmentIcon(segment.type)]"></i>
                </div>
                <div class="segment-details">
                  <template v-if="segment.type === 'walk'">
                    <span class="segment-line">Przejscie piesze</span>
                    <span class="segment-info">{{ segment.duration }} min</span>
                  </template>
                  <template v-else>
                    <span class="segment-line">
                      Linia {{ segment.line }}
                    </span>
                    <span class="segment-info">
                      {{ segment.from }} → {{ segment.to }}
                    </span>
                    <span class="segment-duration">{{ segment.duration }} min</span>
                  </template>
                </div>
              </div>
            </div>

            <button class="select-route-btn">
              <i class="fa-solid fa-check"></i>
              Wybierz trase
            </button>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="hasSearched && routes.length === 0" class="empty-state">
        <i class="fa-solid fa-route"></i>
        <p>Nie znaleziono polaczen</p>
        <span>Sprobuj zmienic przystanki lub godzine odjazdu</span>
      </div>

      <!-- Initial state -->
      <div v-else class="initial-state">
        <i class="fa-solid fa-map-location-dot"></i>
        <p>Wybierz przystanki aby wyszukac polaczenia</p>
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
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
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

.search-card {
  background: var(--card-background);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px var(--shadow-color);
  margin-bottom: 32px;
}

.stops-inputs {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.from-icon {
  color: #2ecc71;
}

.to-icon {
  color: #e74c3c;
}

.input-group select,
.input-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background: var(--background-primary);
  color: var(--text-main);
  transition: all 0.3s ease;
  cursor: pointer;
}

.input-group select:focus,
.input-group input:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.1);
}

.swap-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.swap-btn:hover:not(:disabled) {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

.swap-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-input {
  margin-bottom: 20px;
}

.time-input .input-group {
  max-width: 200px;
}

.search-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: var(--background-main);
  border: none;
  border-radius: 14px;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 31, 63, 0.3);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state,
.empty-state,
.initial-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-additional);
}

.loading-state i,
.empty-state i,
.initial-state i {
  font-size: 56px;
  margin-bottom: 20px;
}

.loading-state i {
  color: var(--background-main);
}

.initial-state i {
  color: var(--background-main);
  opacity: 0.5;
}

.empty-state span,
.initial-state span {
  display: block;
  font-size: 14px;
  margin-top: 8px;
}

.results-section h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.results-section h2 i {
  color: var(--background-main);
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.route-card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: all 0.3s ease;
}

.route-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.route-times {
  display: flex;
  align-items: center;
  gap: 16px;
}

.departure,
.arrival {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.time-line {
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.duration-badge {
  padding: 6px 14px;
  background: var(--background-additional);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--background-main);
}

.route-info {
  display: flex;
  align-items: center;
}

.transfers {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-additional);
}

.route-segments {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.segment {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.segment-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-main);
  border-radius: 10px;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.walk-segment .segment-icon {
  background: var(--background-tertiary);
  color: var(--text-additional);
}

.segment-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.segment-line {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.segment-info {
  font-size: 13px;
  color: var(--text-additional);
}

.segment-duration {
  font-size: 12px;
  color: var(--text-additional);
}

.select-route-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-route-btn:hover {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .search-card {
    padding: 20px;
  }

  .stops-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .swap-btn {
    align-self: center;
    transform: rotate(90deg);
  }

  .route-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .route-times {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
