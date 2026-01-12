<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const selectedDirection = ref(0);

// Mocked lines data
const linesData = {
  '1': {
    id: 1,
    referenceNumber: '1',
    type: 'tram',
    color: '#e74c3c',
    directions: [
      {
        name: 'Salwator',
        stops: [
          { id: 1, name: 'Wzgorza Krzeslawickie', time: '00:00' },
          { id: 2, name: 'Pleszow', time: '00:04' },
          { id: 3, name: 'Nowa Huta', time: '00:08' },
          { id: 4, name: 'Rondo Mogilskie', time: '00:15' },
          { id: 5, name: 'Rondo Grzegorzeckie', time: '00:18' },
          { id: 6, name: 'Dworzec Glowny', time: '00:22' },
          { id: 7, name: 'Rynek Glowny', time: '00:26' },
          { id: 8, name: 'Plac Wszystkich Swietych', time: '00:28' },
          { id: 9, name: 'Salwator', time: '00:35' },
        ],
      },
      {
        name: 'Wzgorza Krzeslawickie',
        stops: [
          { id: 9, name: 'Salwator', time: '00:00' },
          { id: 8, name: 'Plac Wszystkich Swietych', time: '00:07' },
          { id: 7, name: 'Rynek Glowny', time: '00:09' },
          { id: 6, name: 'Dworzec Glowny', time: '00:13' },
          { id: 5, name: 'Rondo Grzegorzeckie', time: '00:17' },
          { id: 4, name: 'Rondo Mogilskie', time: '00:20' },
          { id: 3, name: 'Nowa Huta', time: '00:27' },
          { id: 2, name: 'Pleszow', time: '00:31' },
          { id: 1, name: 'Wzgorza Krzeslawickie', time: '00:35' },
        ],
      },
    ],
    firstDeparture: '04:30',
    lastDeparture: '23:30',
    frequency: { peak: 5, offPeak: 10, weekend: 12 },
  },
  '4': {
    id: 2,
    referenceNumber: '4',
    type: 'tram',
    color: '#3498db',
    directions: [
      {
        name: 'Walcownia',
        stops: [
          { id: 1, name: 'Bronowice', time: '00:00' },
          { id: 2, name: 'Plac Inwalidow', time: '00:06' },
          { id: 3, name: 'Dworzec Glowny', time: '00:12' },
          { id: 4, name: 'Rondo Mogilskie', time: '00:18' },
          { id: 5, name: 'Rondo Grzegorzeckie', time: '00:21' },
          { id: 6, name: 'Walcownia', time: '00:30' },
        ],
      },
      {
        name: 'Bronowice',
        stops: [
          { id: 6, name: 'Walcownia', time: '00:00' },
          { id: 5, name: 'Rondo Grzegorzeckie', time: '00:09' },
          { id: 4, name: 'Rondo Mogilskie', time: '00:12' },
          { id: 3, name: 'Dworzec Glowny', time: '00:18' },
          { id: 2, name: 'Plac Inwalidow', time: '00:24' },
          { id: 1, name: 'Bronowice', time: '00:30' },
        ],
      },
    ],
    firstDeparture: '04:45',
    lastDeparture: '23:15',
    frequency: { peak: 6, offPeak: 12, weekend: 15 },
  },
  '10': {
    id: 4,
    referenceNumber: '10',
    type: 'tram',
    color: '#9b59b6',
    directions: [
      {
        name: 'Lagiewniki',
        stops: [
          { id: 1, name: 'Pleszow', time: '00:00' },
          { id: 2, name: 'Rondo Mogilskie', time: '00:10' },
          { id: 3, name: 'Rondo Grzegorzeckie', time: '00:13' },
          { id: 4, name: 'Dworzec Glowny', time: '00:17' },
          { id: 5, name: 'Wawel', time: '00:22' },
          { id: 6, name: 'Jubilat', time: '00:25' },
          { id: 7, name: 'Lagiewniki', time: '00:35' },
        ],
      },
      {
        name: 'Pleszow',
        stops: [
          { id: 7, name: 'Lagiewniki', time: '00:00' },
          { id: 6, name: 'Jubilat', time: '00:10' },
          { id: 5, name: 'Wawel', time: '00:13' },
          { id: 4, name: 'Dworzec Glowny', time: '00:18' },
          { id: 3, name: 'Rondo Grzegorzeckie', time: '00:22' },
          { id: 2, name: 'Rondo Mogilskie', time: '00:25' },
          { id: 1, name: 'Pleszow', time: '00:35' },
        ],
      },
    ],
    firstDeparture: '05:00',
    lastDeparture: '23:00',
    frequency: { peak: 8, offPeak: 15, weekend: 20 },
  },
  '100': {
    id: 9,
    referenceNumber: '100',
    type: 'autobus',
    color: '#607d8b',
    directions: [
      {
        name: 'Balice Lotnisko',
        stops: [
          { id: 1, name: 'Dworzec Glowny', time: '00:00' },
          { id: 2, name: 'Plac Inwalidow', time: '00:08' },
          { id: 3, name: 'Bronowice', time: '00:15' },
          { id: 4, name: 'Balice Lotnisko', time: '00:35' },
        ],
      },
      {
        name: 'Dworzec Glowny',
        stops: [
          { id: 4, name: 'Balice Lotnisko', time: '00:00' },
          { id: 3, name: 'Bronowice', time: '00:20' },
          { id: 2, name: 'Plac Inwalidow', time: '00:27' },
          { id: 1, name: 'Dworzec Glowny', time: '00:35' },
        ],
      },
    ],
    firstDeparture: '04:00',
    lastDeparture: '00:00',
    frequency: { peak: 15, offPeak: 20, weekend: 30 },
  },
  '144': {
    id: 12,
    referenceNumber: '144',
    type: 'autobus',
    color: '#4caf50',
    directions: [
      {
        name: 'Wieliczka',
        stops: [
          { id: 1, name: 'Rondo Grzegorzeckie', time: '00:00' },
          { id: 2, name: 'Nowy Biezanow', time: '00:15' },
          { id: 3, name: 'Wieliczka', time: '00:30' },
        ],
      },
      {
        name: 'Rondo Grzegorzeckie',
        stops: [
          { id: 3, name: 'Wieliczka', time: '00:00' },
          { id: 2, name: 'Nowy Biezanow', time: '00:15' },
          { id: 1, name: 'Rondo Grzegorzeckie', time: '00:30' },
        ],
      },
    ],
    firstDeparture: '05:00',
    lastDeparture: '22:30',
    frequency: { peak: 15, offPeak: 30, weekend: 30 },
  },
};

// Default line for unknown line numbers
const defaultLine = {
  id: 0,
  referenceNumber: '?',
  type: 'tram',
  color: '#666',
  directions: [
    {
      name: 'Kierunek A',
      stops: [
        { id: 1, name: 'Przystanek 1', time: '00:00' },
        { id: 2, name: 'Przystanek 2', time: '00:05' },
        { id: 3, name: 'Przystanek 3', time: '00:10' },
      ],
    },
    {
      name: 'Kierunek B',
      stops: [
        { id: 3, name: 'Przystanek 3', time: '00:00' },
        { id: 2, name: 'Przystanek 2', time: '00:05' },
        { id: 1, name: 'Przystanek 1', time: '00:10' },
      ],
    },
  ],
  firstDeparture: '05:00',
  lastDeparture: '23:00',
  frequency: { peak: 10, offPeak: 15, weekend: 20 },
};

const lineNumber = computed(() => route.params.lineNumber);
const line = ref(null);

const currentDirection = computed(() => {
  if (!line.value) return null;
  return line.value.directions[selectedDirection.value];
});

const getTypeIcon = (type) => {
  return type === 'tram' ? 'fa-train-tram' : 'fa-bus';
};

const getTypeLabel = (type) => {
  return type === 'tram' ? 'Tramwaj' : 'Autobus';
};

const goBack = () => {
  router.push('/lines');
};

const goToSchedule = (stopName) => {
  router.push({
    path: '/schedule',
    query: {
      line: line.value.referenceNumber,
      stop: stopName,
    },
  });
};

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    line.value = linesData[lineNumber.value] || { ...defaultLine, referenceNumber: lineNumber.value };
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <!-- Back button -->
      <button class="back-btn" @click="goBack">
        <i class="fa-solid fa-arrow-left"></i>
        Powrot do listy linii
      </button>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ladowanie danych linii...</p>
      </div>

      <template v-else-if="line">
        <!-- Line header -->
        <div class="line-header">
          <div class="line-badge" :style="{ backgroundColor: line.color }">
            <i :class="['fa-solid', getTypeIcon(line.type)]"></i>
            <span class="line-number">{{ line.referenceNumber }}</span>
          </div>
          <div class="line-title">
            <span class="line-type-label">{{ getTypeLabel(line.type) }}</span>
            <h1>Linia {{ line.referenceNumber }}</h1>
            <p class="line-route">
              {{ line.directions[0].name }} - {{ line.directions[1].name }}
            </p>
          </div>
        </div>

        <!-- Info cards -->
        <div class="info-cards">
          <div class="info-card">
            <i class="fa-solid fa-clock"></i>
            <div class="info-content">
              <span class="info-label">Kursowanie</span>
              <span class="info-value">{{ line.firstDeparture }} - {{ line.lastDeparture }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="fa-solid fa-stopwatch"></i>
            <div class="info-content">
              <span class="info-label">Czestotliwosc (szczyt)</span>
              <span class="info-value">co {{ line.frequency.peak }} min</span>
            </div>
          </div>
          <div class="info-card">
            <i class="fa-solid fa-moon"></i>
            <div class="info-content">
              <span class="info-label">Czestotliwosc (pozaszyt)</span>
              <span class="info-value">co {{ line.frequency.offPeak }} min</span>
            </div>
          </div>
          <div class="info-card">
            <i class="fa-solid fa-calendar-week"></i>
            <div class="info-content">
              <span class="info-label">Weekend</span>
              <span class="info-value">co {{ line.frequency.weekend }} min</span>
            </div>
          </div>
        </div>

        <!-- Direction selector -->
        <div class="direction-section">
          <h2>
            <i class="fa-solid fa-route"></i>
            Trasa
          </h2>
          <div class="direction-tabs">
            <button
              v-for="(direction, index) in line.directions"
              :key="index"
              :class="{ active: selectedDirection === index }"
              @click="selectedDirection = index"
            >
              <i class="fa-solid fa-arrow-right"></i>
              {{ direction.name }}
            </button>
          </div>
        </div>

        <!-- Stops list -->
        <div class="stops-section">
          <div class="stops-list">
            <div
              v-for="(stop, index) in currentDirection.stops"
              :key="stop.id"
              class="stop-item"
              :class="{
                'first-stop': index === 0,
                'last-stop': index === currentDirection.stops.length - 1,
              }"
              @click="goToSchedule(stop.name)"
            >
              <div class="stop-indicator">
                <div class="stop-line" :style="{ backgroundColor: line.color }"></div>
                <div class="stop-dot" :style="{ borderColor: line.color }"></div>
              </div>
              <div class="stop-info">
                <span class="stop-name">{{ stop.name }}</span>
                <span class="stop-time">+{{ stop.time }}</span>
              </div>
              <button class="schedule-btn">
                <i class="fa-solid fa-clock"></i>
              </button>
            </div>
          </div>
        </div>
      </template>
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

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.back-btn:hover {
  border-color: var(--background-main);
  color: var(--background-main);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-additional);
}

.loading-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--background-main);
}

.line-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.line-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  color: white;
}

.line-badge i {
  font-size: 24px;
  margin-bottom: 4px;
}

.line-badge .line-number {
  font-size: 36px;
  font-weight: 700;
}

.line-title {
  flex: 1;
}

.line-type-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-additional);
}

.line-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0;
}

.line-route {
  font-size: 16px;
  color: var(--text-additional);
  margin: 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card-background);
  border-radius: 14px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.info-card i {
  font-size: 24px;
  color: var(--background-main);
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: var(--text-additional);
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.direction-section {
  margin-bottom: 24px;
}

.direction-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.direction-section h2 i {
  color: var(--background-main);
}

.direction-tabs {
  display: flex;
  gap: 12px;
}

.direction-tabs button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.direction-tabs button:hover {
  border-color: var(--background-main);
}

.direction-tabs button.active {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

.stops-section {
  background: var(--card-background);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.stops-list {
  display: flex;
  flex-direction: column;
}

.stop-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stop-item:hover {
  background: var(--background-tertiary);
  margin: 0 -24px;
  padding: 12px 24px;
  border-radius: 8px;
}

.stop-indicator {
  position: relative;
  width: 24px;
  display: flex;
  justify-content: center;
}

.stop-line {
  position: absolute;
  width: 4px;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.first-stop .stop-line {
  top: 50%;
  height: 50%;
}

.last-stop .stop-line {
  height: 50%;
}

.stop-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--card-background);
  border: 4px solid;
  z-index: 1;
}

.first-stop .stop-dot,
.last-stop .stop-dot {
  width: 20px;
  height: 20px;
  background: currentColor;
  border-width: 4px;
}

.stop-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stop-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.stop-time {
  font-size: 13px;
  color: var(--text-additional);
  font-family: monospace;
}

.schedule-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);
  border: none;
  border-radius: 8px;
  color: var(--text-additional);
  cursor: pointer;
  transition: all 0.3s ease;
}

.schedule-btn:hover {
  background: var(--background-main);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .line-header {
    flex-direction: column;
    text-align: center;
  }

  .line-badge {
    width: 80px;
    height: 80px;
  }

  .line-badge .line-number {
    font-size: 28px;
  }

  .line-title h1 {
    font-size: 24px;
  }

  .info-cards {
    grid-template-columns: 1fr 1fr;
  }

  .direction-tabs {
    flex-direction: column;
  }

  .stops-section {
    padding: 16px;
  }

  .stop-item:hover {
    margin: 0 -16px;
    padding: 12px 16px;
  }
}
</style>
