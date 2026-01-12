<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const searchQuery = ref('');
const selectedType = ref('all');

const lines = ref([
  { id: 1, referenceNumber: '1', type: 'tram', directionName: 'Salwator - Wzgorza Krzeslawickie', color: '#e74c3c' },
  { id: 2, referenceNumber: '4', type: 'tram', directionName: 'Bronowice - Walcownia', color: '#3498db' },
  { id: 3, referenceNumber: '8', type: 'tram', directionName: 'Borek Falecki - Bronowice Male', color: '#2ecc71' },
  { id: 4, referenceNumber: '10', type: 'tram', directionName: 'Pleszow - Lagiewniki', color: '#9b59b6' },
  { id: 5, referenceNumber: '13', type: 'tram', directionName: 'Bronowice - Nowy Biezanow', color: '#f39c12' },
  { id: 6, referenceNumber: '18', type: 'tram', directionName: 'Czerwone Maki - Krowodrza Gorka', color: '#1abc9c' },
  { id: 7, referenceNumber: '50', type: 'tram', directionName: 'Kurdwanow - Krowodrza Gorka', color: '#e91e63' },
  { id: 8, referenceNumber: '52', type: 'tram', directionName: 'Czerwone Maki - Os. Piastow', color: '#00bcd4' },
  { id: 9, referenceNumber: '100', type: 'autobus', directionName: 'Dworzec Glowny - Balice Lotnisko', color: '#607d8b' },
  { id: 10, referenceNumber: '124', type: 'autobus', directionName: 'Plac Inwalidow - Os. Podwawelskie', color: '#795548' },
  { id: 11, referenceNumber: '139', type: 'autobus', directionName: 'Maly Plaszow - Os. Zlotego Wieku', color: '#ff5722' },
  { id: 12, referenceNumber: '144', type: 'autobus', directionName: 'Rondo Grzegorzeckie - Wieliczka', color: '#4caf50' },
  { id: 13, referenceNumber: '152', type: 'autobus', directionName: 'Rondo Mogilskie - Ruszcza', color: '#673ab7' },
  { id: 14, referenceNumber: '159', type: 'autobus', directionName: 'Os. Podwawelskie - Skawina', color: '#009688' },
  { id: 15, referenceNumber: '173', type: 'autobus', directionName: 'Bronowice - Balice', color: '#ff9800' },
  { id: 16, referenceNumber: '192', type: 'autobus', directionName: 'Dworzec Glowny - Nowa Huta', color: '#8bc34a' },
]);

const filteredLines = computed(() => {
  return lines.value.filter(line => {
    const matchesSearch = line.referenceNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          line.directionName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = selectedType.value === 'all' || line.type === selectedType.value;
    return matchesSearch && matchesType;
  });
});

const tramLines = computed(() => filteredLines.value.filter(l => l.type === 'tram'));
const busLines = computed(() => filteredLines.value.filter(l => l.type === 'autobus'));

const getTypeIcon = (type) => {
  return type === 'tram' ? 'fa-train-tram' : 'fa-bus';
};

const getTypeLabel = (type) => {
  return type === 'tram' ? 'Tramwaj' : 'Autobus';
};

const goToLineDetails = (lineNumber) => {
  router.push(`/lines/${lineNumber}`);
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="page-header">
        <h1>Linie komunikacyjne</h1>
        <p class="subtitle">Sprawdz dostepne linie tramwajowe i autobusowe</p>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Szukaj linii lub kierunku..."
          />
        </div>
        <div class="type-filter">
          <button
            :class="{ active: selectedType === 'all' }"
            @click="selectedType = 'all'"
          >
            <i class="fa-solid fa-list"></i>
            Wszystkie
          </button>
          <button
            :class="{ active: selectedType === 'tram' }"
            @click="selectedType = 'tram'"
          >
            <i class="fa-solid fa-train-tram"></i>
            Tramwaje
          </button>
          <button
            :class="{ active: selectedType === 'autobus' }"
            @click="selectedType = 'autobus'"
          >
            <i class="fa-solid fa-bus"></i>
            Autobusy
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ladowanie linii...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredLines.length === 0" class="empty-state">
        <i class="fa-solid fa-route"></i>
        <p>Nie znaleziono linii</p>
      </div>

      <!-- Lines list -->
      <div v-else class="lines-content">
        <!-- Tram section -->
        <section v-if="tramLines.length > 0 && (selectedType === 'all' || selectedType === 'tram')" class="lines-section">
          <h2>
            <i class="fa-solid fa-train-tram"></i>
            Tramwaje
          </h2>
          <div class="lines-grid">
            <div
              v-for="line in tramLines"
              :key="line.id"
              class="line-card"
              @click="goToLineDetails(line.referenceNumber)"
            >
              <div class="line-number" :style="{ backgroundColor: line.color }">
                {{ line.referenceNumber }}
              </div>
              <div class="line-info">
                <span class="line-type">
                  <i :class="['fa-solid', getTypeIcon(line.type)]"></i>
                  {{ getTypeLabel(line.type) }}
                </span>
                <span class="line-direction">{{ line.directionName }}</span>
              </div>
              <button class="line-details-btn">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Bus section -->
        <section v-if="busLines.length > 0 && (selectedType === 'all' || selectedType === 'autobus')" class="lines-section">
          <h2>
            <i class="fa-solid fa-bus"></i>
            Autobusy
          </h2>
          <div class="lines-grid">
            <div
              v-for="line in busLines"
              :key="line.id"
              class="line-card"
              @click="goToLineDetails(line.referenceNumber)"
            >
              <div class="line-number" :style="{ backgroundColor: line.color }">
                {{ line.referenceNumber }}
              </div>
              <div class="line-info">
                <span class="line-type">
                  <i :class="['fa-solid', getTypeIcon(line.type)]"></i>
                  {{ getTypeLabel(line.type) }}
                </span>
                <span class="line-direction">{{ line.directionName }}</span>
              </div>
              <button class="line-details-btn">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
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

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
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
  padding: 14px 16px 14px 48px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background: var(--card-background);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--background-main);
  box-shadow: 0 0 0 3px rgba(0, 31, 63, 0.1);
}

.type-filter {
  display: flex;
  gap: 8px;
}

.type-filter button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-background);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-filter button:hover {
  border-color: var(--background-main);
}

.type-filter button.active {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
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

.lines-section {
  margin-bottom: 40px;
}

.lines-section h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.lines-section h2 i {
  color: var(--background-main);
}

.lines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.line-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--card-background);
  border-radius: 14px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.line-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.line-number {
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.line-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.line-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-additional);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.line-direction {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.line-details-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--background-tertiary);
  border-radius: 10px;
  color: var(--text-additional);
  cursor: pointer;
  transition: all 0.3s ease;
}

.line-details-btn:hover {
  background: var(--background-main);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .filters {
    flex-direction: column;
  }

  .type-filter {
    width: 100%;
    overflow-x: auto;
  }

  .type-filter button {
    flex: 1;
    justify-content: center;
    padding: 10px 12px;
    font-size: 13px;
  }

  .lines-grid {
    grid-template-columns: 1fr;
  }
}
</style>
