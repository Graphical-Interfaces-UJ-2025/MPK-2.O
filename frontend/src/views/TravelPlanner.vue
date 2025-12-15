<script setup>
import BigImage from '@/components/Home/BigImage.vue';
import Video from '@/components/Home/Video.vue';
import Text from '@/components/Home/Text.vue';
import Contact from '@/components/Home/Contact.vue';
import CardsSlider from '@/components/Home/CardsSlider.vue';
import Cards from '@/components/Home/Cards.vue';
import Car from '@/components/InfoPopUp/Announcement.vue';

import { ref, onMounted, computed, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInfoStore } from '@/stores/infoPopUp';
const infoStore = useInfoStore();

const { t } = useI18n();

const carsData = ref([]);

onMounted(async () => {
  const response = await fetch('/data/cars.json');
  const data = await response.json();
  carsData.value = data;
});

const offers = computed(() => [
  {
    icon: 'fa-car',
    title: t('offers.personalCars.title'),
    description: t('offers.personalCars.description'),
  },
  {
    icon: 'fa-shuttle-van',
    title: t('offers.vans.title'),
    description: t('offers.vans.description'),
  },
  {
    icon: 'fa-briefcase',
    title: t('offers.business.title'),
    description: t('offers.business.description'),
  },
  {
    icon: 'fa-gem',
    title: t('offers.premium.title'),
    description: t('offers.premium.description'),
  },
  {
    icon: 'fa-briefcase',
    title: t('offers.business.title'),
    description: t('offers.business.description'),
  },
  {
    icon: 'fa-gem',
    title: t('offers.premium.title'),
    description: t('offers.premium.description'),
  },
]);


function cardClick(data) {
  infoStore.showInfo({
    title: data.title,
    component: markRaw(Car),
    componentData: data,
  });
}
</script>


<template>
  <main>
    <BigImage src="https://t4.ftcdn.net/jpg/02/82/00/75/360_F_282007508_wdCUP7hUMNK1Cuzj7XmOcFmzyzJ0Nnp9.jpg"
      style="background-color: var(--background-additional)" />

    <Text id="about" :title="t('sections.about')" style="background-color: var(--background-main)" />
    <Video
      src="https://hips.hearstapps.com/hmg-prod/images/vol-27-pcoty-2025-group-1-677dbc61d16c0.jpg?crop=0.819xw:0.918xh;0.112xw,0.0815xh&resize=768:*"
      style="background-color: var(--background-primary)" :description="t('sections.welcome')" :isImage="true" />
    <Text id="vehicles" :title="t('sections.fleet')" style="background-color: var(--background-main)" />
    <Text id="offert" :title="t('sections.offer')" style="background-color: var(--background-main)" />
    <Cards :offers="offers" :t="t" />
    <Contact id="contact" :title="t('sections.contact')" style="background-color: var(--background-additional)"
      email="test@gmail.com" phone="+48 123 456 789" />
  </main>
</template>
