<script setup>
import BigImage from '@/components/Home/BigImage.vue';
import Video from '@/components/Home/Video.vue';
import Text from '@/components/Home/Text.vue';
import Contact from '@/components/Home/Contact.vue';
import CardsSlider from '@/components/Home/CardsSlider.vue';
import Gallery from '@/components/Home/Gallery.vue';
import Cards from '@/components/Home/Cards.vue';
import Car from '@/components/InfoPopUp/Car.vue';

import { ref, onMounted, computed, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInfoStore } from '@/stores/infoPopUp';
const infoStore = useInfoStore();

const { t } = useI18n();

const qaList = computed(() => [
  {
    icon: 'fa-ticket',
    title: t('offers.ticketTypes.title') || 'Rodzaje biletów',
    description: t('offers.ticketTypes.description') || 'Bilety jednorazowe, okresowe, dla studentów i seniorów dostępne w różnych strefach tarifu',
  },
  {
    icon: 'fa-bus',
    title: t('offers.busRoutes.title') || 'Linie autobusowe',
    description: t('offers.busRoutes.description') || 'Ponad 70 linii autobusowych kursujących po Krakowie i okolicach z różną częstotliwością',
  },
  {
    icon: 'fa-train',
    title: t('offers.tramRoutes.title') || 'Linie tramwajowe',
    description: t('offers.tramRoutes.description') || '24 linie tramwajowe łączące wszystkie dzielnice miasta z nowoczesnym taborem',
  },
  {
    icon: 'fa-wheelchair',
    title: t('offers.accessibility.title') || 'Dostępność',
    description: t('offers.accessibility.description') || 'Autobusy i tramwaje wyposażone w windy, podjazdy dla osób niepełnosprawnych',
  },
  {
    icon: 'fa-leaf',
    title: t('offers.ecoTransport.title') || 'Transport ekologiczny',
    description: t('offers.ecoTransport.description') || 'Elektryczne tramwaje i autobusy zmniejszające emisję zanieczyszczeń w mieście',
  },
  {
    icon: 'fa-mobile',
    title: t('offers.mobilityApp.title') || 'Aplikacja mobilna',
    description: t('offers.mobilityApp.description') || 'Aplikacja MPK pozwala sprawdzić rozkład jazdy, śledzić pojazdy i kupić bilety online',
  },
]);

const communicationData = computed(() => [
  {
    img: {
      src: "img/tesla3.png",
      alt: "Utrudnienia na linii 4"
    },
    title: "Utrudnienia na linii 4",
    description: "Od 15 marca tramwaj linii 4 będzie kursować trasą objazdową z powodu prac remontowych na Kopernika...",
    year: 2024,
    mileage: 0,
    fuel: "Informacja",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Nowe bilety okresowe"
    },
    title: "Nowe bilety miesięczne",
    description: "Od kwietnia dostępne są nowe, tańsze bilety miesięczne ze zniżką 10% dla studentów i seniorów...",
    year: 2024,
    mileage: 0,
    fuel: "Promocja",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Rozszerzenie sieci autobusowej"
    },
    title: "Nowe linie autobusowe",
    description: "Uruchomiliśmy 3 nowe linie autobusowe łączące Kraków z pobliskimi gminami Wieliczką i Tarnowem...",
    year: 2024,
    mileage: 0,
    fuel: "Rozwój",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Zakupy nowych tramwajów"
    },
    title: "Zakup nowych tramwajów Pesa",
    description: "MPK Kraków zamówił 20 nowoczesnych tramwajów Pesa, które będą stopniowo wdrażane od 2025 roku...",
    year: 2024,
    mileage: 0,
    fuel: "Inwestycja",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Bezpłatny transport dla seniora"
    },
    title: "Transport bezpłatny dla seniorów",
    description: "Od maja seniorzy powyżej 70 lat mogą korzystać z komunikacji miejskiej całkowicie bezpłatnie...",
    year: 2024,
    mileage: 0,
    fuel: "Społecznie",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Aplikacja mobilna MPK"
    },
    title: "Nowa wersja aplikacji MPK",
    description: "Właśnie wydaliśmy nową wersję aplikacji MPK z śledzeniem pojazdu w czasie rzeczywistym i alertami...",
    year: 2024,
    mileage: 0,
    fuel: "Technologia",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  },
  {
    img: {
      src: "img/tesla3.png",
      alt: "Zwiększenie częstotliwości"
    },
    title: "Zwiększona częstotliwość linii 15",
    description: "Ze względu na duże zainteresowanie pasażerów, tramwaj linii 15 będzie kursować co 4 minuty zamiast co 6...",
    year: 2024,
    mileage: 0,
    fuel: "Usługa",
    transmission: "Ważne",
    bodyType: "Komunikat",
    power: 0,
    capacity: 0
  }
])

const imageList = [
  {
    src: 'https://s3w1.alltransua.com/photo/00/09/75/00097529.jpg?hash=57c951728b9fc4f07d319326aee58328',
    alt: 'Tram1',
    caption: 'Tramwaj na Salwatorze',
  },
  {
    src: 'https://mpk.krakow.pl/media/photos/15/original.jpg',
    alt: 'Photo1',
    caption: 'Most',
  },
  {
    src: 'https://cdn-sw.spidersweb.pl/2024/08/shutterstock_2469470849.jpg',
    alt: 'Tram2',
    caption: 'Tramwaj Bombardier',
  },
  {
    src: 'https://mpk.krakow.pl/media/photos/6948/l.jpg',
    alt: 'Autobus1',
    caption: 'Autobus w zajezdni',
  },
  {
    src: 'https://mpk.krakow.pl/media/photos/6945/l.jpg',
    alt: 'Autobus2',
    caption: 'Autobusy w zajezdni',
  },
  {
    src: 'https://transinfo.pl/wp-content/uploads/2023/05/347419349_781668313609470_9005993725611419610_n.jpg',
    alt: 'Tram3',
    caption: 'Tramwaj na skrzyżowaniu',
  },
];

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
    <Gallery :images="imageList" />
    <Text id="communication" :title="t('sections.communication')" style="background-color: var(--background-main)" />
    <CardsSlider :data="communicationData" />
    <Text id="qa" :title="t('sections.qa')" style="background-color: var(--background-main)" />
    <Cards :cards="qaList" :t="t" />
    <Text id="map" :title="t('sections.map')" style="background-color: var(--background-main)" />
    <BigImage src="img/interactive-map.jpg" style="padding: 30px;" />
    <Contact id="contact" :title="t('sections.contact')" style="background-color: var(--background-additional)"
      email="mpk@uj.edu.com" phone="+48 123 456 789" />
  </main>
</template>
