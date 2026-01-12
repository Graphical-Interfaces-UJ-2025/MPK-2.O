<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const selectedDay = ref('weekday');

// Get query params
const lineNumber = computed(() => route.query.line || '');
const stopName = computed(() => route.query.stop || '');

// Mocked schedule data - departure times for different lines at different stops
const scheduleData = ref({
  departures: [],
  lineInfo: null,
});

// Line colors
const lineColors = {
  '1': '#e74c3c',
  '4': '#3498db',
  '8': '#2ecc71',
  '10': '#9b59b6',
  '13': '#f39c12',
  '18': '#1abc9c',
  '50': '#e91e63',
  '52': '#00bcd4',
  '100': '#607d8b',
  '124': '#795548',
  '139': '#ff5722',
  '144': '#4caf50',
  '152': '#673ab7',
  '159': '#009688',
  '173': '#ff9800',
  '192': '#8bc34a',
};

// Generate schedule times
const generateSchedule = (baseMinute, interval, startHour, endHour) => {
  const times = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const hourTimes = [];
    let minute = baseMinute;
    while (minute < 60) {
      hourTimes.push(minute.toString().padStart(2, '0'));
      minute += interval;
    }
    if (hourTimes.length > 0) {
      times.push({ hour, minutes: hourTimes });
    }
  }
  return times;
};

// Mocked schedules for different day types
const getScheduleForDay = (dayType) => {
  const baseMinute = Math.floor(Math.random() * 10);

  if (dayType === 'weekday') {
    return generateSchedule(baseMinute, 8, 5, 23);
  } else if (dayType === 'saturday') {
    return generateSchedule(baseMinute, 12, 6, 23);
  } else {
    return generateSchedule(baseMinute, 15, 7, 22);
  }
};

const filteredSchedule = computed(() => {
  return getScheduleForDay(selectedDay.value);
});

const getLineColor = (line) => {
  return lineColors[line] || '#666';
};

const getTypeIcon = (type) => {
  return type === 'tram' ? 'fa-train-tram' : 'fa-bus';
};

const goBack = () => {
  if (lineNumber.value) {
    router.push(`/lines/${lineNumber.value}`);
  } else {
    router.push('/stops');
  }
};

const goToLine = () => {
  if (lineNumber.value) {
    router.push(`/lines/${lineNumber.value}`);
  }
};

// Get current time for highlighting
const currentHour = new Date().getHours();
const currentMinute = new Date().getMinutes();

const isCurrentTime = (hour, minute) => {
  return hour === currentHour && Math.abs(parseInt(minute) - currentMinute) < 10;
};

const isPastTime = (hour, minute) => {
  if (hour < currentHour) return true;
  if (hour === currentHour && parseInt(minute) < currentMinute) return true;
  return false;
};

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    const lineNum = lineNumber.value || '1';
    const isTram = ['1', '4', '8', '10', '13', '18', '50', '52'].includes(lineNum);

    scheduleData.value = {
      lineInfo: {
        referenceNumber: lineNum,
        type: isTram ? 'tram' : 'autobus',
        color: getLineColor(lineNum),
        direction: 'Centrum',
      },
      departures: getScheduleForDay('weekday'),
    };
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
        Powrot
      </button>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Ladowanie rozkladu jazdy...</p>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="schedule-header">
          <div class="stop-info-header">
            <div class="stop-icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="stop-details">
              <span class="stop-label">Rozklad jazdy</span>
              <h1>{{ stopName || 'Przystanek' }}</h1>
            </div>
          </div>

          <!-- Line badge (if specific line selected) -->
          <div
            v-if="lineNumber"
            class="line-badge-large"
            :style="{ backgroundColor: scheduleData.lineInfo?.color }"
            @click="goToLine"
          >
            <i :class="['fa-solid', getTypeIcon(scheduleData.lineInfo?.type)]"></i>
            <span>{{ lineNumber }}</span>
          </div>
        </div>

        <!-- Day type selector -->
        <div class="day-selector">
          <button
            :class="{ active: selectedDay === 'weekday' }"
            @click="selectedDay = 'weekday'"
          >
            <i class="fa-solid fa-briefcase"></i>
            Dni robocze
          </button>
          <button
            :class="{ active: selectedDay === 'saturday' }"
            @click="selectedDay = 'saturday'"
          >
            <i class="fa-solid fa-calendar-day"></i>
            Sobota
          </button>
          <button
            :class="{ active: selectedDay === 'sunday' }"
            @click="selectedDay = 'sunday'"
          >
            <i class="fa-solid fa-sun"></i>
            Niedziela
          </button>
        </div>

        <!-- Legend -->
        <div class="legend">
          <div class="legend-item">
            <span class="legend-dot current"></span>
            <span>Najblizszy odjazd</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot past"></span>
            <span>Odjechalo</span>
          </div>
        </div>

        <!-- Schedule table -->
        <div class="schedule-card">
          <div class="schedule-table">
            <div
              v-for="hourData in filteredSchedule"
              :key="hourData.hour"
              class="schedule-row"
              :class="{ 'current-hour': hourData.hour === currentHour }"
            >
              <div class="hour-cell">
                {{ hourData.hour.toString().padStart(2, '0') }}
              </div>
              <div class="minutes-cell">
                <span
                  v-for="minute in hourData.minutes"
                  :key="minute"
                  class="minute-badge"
                  :class="{
                    current: isCurrentTime(hourData.hour, minute),
                    past: isPastTime(hourData.hour, minute),
                  }"
                >
                  {{ minute }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info section -->
        <div class="info-section">
          <div class="info-item">
            <i class="fa-solid fa-info-circle"></i>
            <span>Rozklad moze ulec zmianie w dni swiateczne</span>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-clock"></i>
            <span>Ostatnia aktualizacja: dzisiaj</span>
          </div>
        </div>

        <!-- Other lines at this stop (if no specific line selected) -->
        <div v-if="!lineNumber" class="other-lines-section">
          <h2>
            <i class="fa-solid fa-bus"></i>
            Inne linie na tym przystanku
          </h2>
          <div class="lines-grid">
            <router-link
              v-for="line in ['1', '4', '10', '13', '50']"
              :key="line"
              :to="{ path: '/schedule', query: { line, stop: stopName } }"
              class="line-badge-small"
              :style="{ backgroundColor: getLineColor(line) }"
            >
              {{ line }}
            </router-link>
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

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.stop-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stop-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-main);
  border-radius: 14px;
  color: var(--text-secondary);
  font-size: 24px;
}

.stop-details {
  display: flex;
  flex-direction: column;
}

.stop-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-additional);
}

.stop-details h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0 0 0;
}

.line-badge-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 14px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.line-badge-large:hover {
  transform: scale(1.05);
}

.line-badge-large i {
  font-size: 16px;
  margin-bottom: 2px;
}

.line-badge-large span {
  font-size: 24px;
  font-weight: 700;
}

.day-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.day-selector button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-selector button:hover {
  border-color: var(--background-main);
}

.day-selector button.active {
  background: var(--background-main);
  border-color: var(--background-main);
  color: var(--text-secondary);
}

.legend {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--card-background);
  border-radius: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-additional);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.legend-dot.current {
  background: var(--background-main);
}

.legend-dot.past {
  background: var(--text-additional);
  opacity: 0.5;
}

.schedule-card {
  background: var(--card-background);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
  margin-bottom: 24px;
}

.schedule-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.schedule-row {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.schedule-row:hover {
  background: var(--background-tertiary);
}

.schedule-row.current-hour {
  background: var(--background-tertiary);
}

.hour-cell {
  width: 50px;
  font-size: 18px;
  font-weight: 700;
  color: var(--background-main);
  font-family: monospace;
}

.minutes-cell {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.minute-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  background: var(--background-tertiary);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-family: monospace;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.minute-badge:hover {
  background: var(--background-main);
  color: var(--text-secondary);
}

.minute-badge.current {
  background: var(--background-main);
  color: var(--text-secondary);
  animation: pulse 2s infinite;
}

.minute-badge.past {
  opacity: 0.4;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--card-background);
  border-radius: 12px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-additional);
}

.info-item i {
  color: var(--background-main);
}

.other-lines-section {
  margin-top: 32px;
}

.other-lines-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.other-lines-section h2 i {
  color: var(--background-main);
}

.lines-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.line-badge-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.line-badge-small:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stop-details h1 {
    font-size: 20px;
  }

  .day-selector {
    flex-direction: column;
  }

  .day-selector button {
    padding: 12px;
  }

  .legend {
    flex-direction: column;
    gap: 8px;
  }

  .hour-cell {
    width: 40px;
    font-size: 16px;
  }

  .minute-badge {
    min-width: 28px;
    height: 26px;
    font-size: 13px;
  }
}
</style>
