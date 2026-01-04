<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';

import NavBarButton from '@/components/NavBarButton.vue';
import SpecialButton from '@/components/Home/SpecialButton.vue';
import NavBarButtonDropdown from '@/components/NavBarButtonDropdown.vue';
import Communication from '@/components/InfoPopUp/Announcement.vue';
import UserMenu from '@/components/UserMenu.vue';

const { t, locale } = useI18n();
const authStore = useAuthStore();

const pages = computed(() => [
  { label: t('nav.tickets'), path: '/tickets' },
  { label: t('nav.lines'), path: '/lines' },
  { label: t('nav.stops'), path: '/stops' },
  { label: t('nav.travelPlanner'), path: '/travel-planner' },
  { label: t('nav.interactiveMap'), path: '/interactive-map' },
  { label: t('nav.trains'), path: '/trains' },
  { label: t('nav.contact'), path: '/#contact' },
]);


const navBarDropdown = ref(false);
const languageDropdown = ref(false);

const theme = ref(localStorage.getItem('theme') || 'light');

const applyTheme = (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  applyTheme(theme.value);
};

const changeLanguage = (language) => {
  locale.value = language;
  localStorage.setItem('locale', language);
};

onMounted(() => {
  locale.value = localStorage.getItem('locale') || 'pl';
  applyTheme(theme.value);
});
</script>

<template>
  <div id="main-app">
    <header :class="{ active: navBarDropdown }">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>MPK <b>2.0</b></h1>
        </router-link>

        <div class="header-right">
          <div class="settings">
            <div class="dark-mode">
              <i v-if="theme == 'light'" @click="toggleTheme" class="fa-solid fa-moon"></i>
              <i v-if="theme == 'dark'" @click="toggleTheme" class="fa-solid fa-sun"></i>
            </div>
            <div class="language">
              <i class="fa-solid fa-globe" @click="languageDropdown = !languageDropdown"></i>
              <div class="language-dropdown" :class="{ active: languageDropdown && !navBarDropdown }">
                <img src="/flags/pl.svg" alt="Polski" @click="changeLanguage('pl')" />
                <img src="/flags/us.svg" alt="English" @click="changeLanguage('en')" />
              </div>
            </div>
          </div>
          <UserMenu v-if="authStore.isAuthenticated" />
          <router-link v-else :to="{ path: '/login' }">
            <SpecialButton :title="t('loginButton')" />
          </router-link>
          <div class="phone">
            <i class="fa-solid fa-bars" @click="navBarDropdown = !navBarDropdown"></i>
          </div>
        </div>
      </div>
    </header>
    <nav :class="{ active: navBarDropdown }">
      <div class="nav-links">
        <router-link v-for="(page, index) in pages" v-bind:key="index" :to="{ path: page.path, hash: page.hash }">
          <NavBarButton :title="page.label" />
        </router-link>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <transition>
        <component class="main-content" :is="Component" />
      </transition>
    </router-view>

    <footer>{{ $t('footer') }}</footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#main-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--background-primary);
}

header {
  background-color: var(--background-secondary);
  box-shadow: 0 0 10px var(--header-shadow);
  width: 100%;
  max-height: 80px;
  padding: 0 10px;
  transition: all 1s ease;
  overflow: hidden;
  border-bottom: 2px solid var(--background-main);
}

.header-content {
  display: flex;
  align-items: center;
  height: 80px;
}

nav {
  background-color: var(--background-main);
  color: var(--text-primary);
  width: 100%;
  transition: all 1s ease;
  overflow: hidden;
  border-bottom: 2px solid var(--navbar-border);
}

nav.active {
  max-height: 1000px;
  padding: 15px 10px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo img {
  max-height: 90px;
  width: auto;
}

.logo:hover {
  transform: scale(1.05);
}

.logo h1 {
  font-size: 40px;
  margin: 0;
  color: var(--text-primary);
  text-decoration: none;
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  gap: 15px;
}

.settings {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 80px;
  height: 30px;
  border-left: 2px solid var(--text-additional);
  border-right: 2px solid var(--text-additional);
  height: 25px;
  padding: 0 5px;
}

.setting-phone {
  margin-top: 10px;
  /* border: none; */
}

.dark-mode i {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
  color: var(--text-primary);
  cursor: pointer;
  width: 25px;
  height: 25px;
  transition: all 0.3s;
  color: var(--text-primary);
}

.dark-mode i:hover {
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}

.language i {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
  color: var(--text-primary);
  cursor: pointer;
  width: 25px;
  height: 25px;
  transition: all 0.3s;
  color: var(--text-primary);
}

.language i:hover {
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}

.language-dropdown {
  position: fixed;
  width: 40px;
  min-height: 0;
  max-height: 0;
  margin-left: -6px;
  margin-top: 4px;
  background: var(--background-main);
  border-radius: 5px;
  transition: all 0.5s ease;
  overflow: hidden;
}

.language-dropdown.active {
  max-height: 500px;
}

.language-dropdown img {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 6px;
  height: auto;
  cursor: pointer;
  padding: 1px 4px;
}

.language-dropdown img:first-of-type {
  margin-top: 4px;
}

.language-dropdown img:hover {
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}

.phone i {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 25px;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 50px;
  height: 80px;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.main-content {
  background: var(--background-primary);
  flex: 1;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

footer {
  background-color: var(--background-secondary);
  color: var(--text-primary);
  text-align: center;
  padding: 20px;
  font-size: 14px;
  letter-spacing: 1px;
  border-top: 1px solid var(--text-additional);
  width: 100%;
  position: relative;
}

footer::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: var(--text-primary);
  border-radius: 2px;
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: var(--header-bg);
  box-shadow: 0 0 10px var(--header-shadow);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-menu>* {
  display: block;
  padding: 10px 20px;
  color: var(--text-primary);
  text-decoration: none;
}

.dropdown-menu>*:hover {
  background-color: var(--background-additional);
}

@media (max-width: 1250px) {
  .nav-links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 15px;
  }

  .settings {
    display: none;
  }

  nav {
    max-height: 0px;
    padding: 0 10px;
  }

  .phone {
    display: flex;
  }
}

@media (min-width: 1250px) {
  .nav-links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15%;
    gap: 25px;
  }

  nav {
    max-height: 100px;
    padding: 15px 10px;
  }

  .settings {
    display: flex;
  }

  .phone {
    display: none;
  }
}
</style>
