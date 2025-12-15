<script setup>
import BigImage from '@/components/Home/BigImage.vue';
import Video from '@/components/Home/Video.vue';
import Text from '@/components/Home/Text.vue';
import Contact from '@/components/Home/Contact.vue';
import CardsSlider from '@/components/Home/CardsSlider.vue';
import Gallery from '@/components/Home/Gallery.vue';
import Cards from '@/components/Home/Cards.vue';

import { ref, onMounted, computed, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInfoStore } from '@/stores/infoPopUp';
import Announcement from '@/components/InfoPopUp/Announcement.vue';
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
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Utrudnienia na linii 4"
    },
    icon: "fa-solid fa-triangle-exclamation",
    title: "Utrudnienia na linii 4",
    type: "Informacja o utrudnieniach",
    description: "Od 15 marca tramwaj linii 4 będzie kursować trasą objazdową z powodu prac remontowych na ulicy Kopernika. Przystanki zostały przeniesione na ulicę Słoneczną.",
    metadata: {
      "Data obowiązywania": "15.03.2025",
      "Linia": "4",
      "Pojazd": "Tramwaj",
      "Powód": "Prace remontowe"
    },
    tags: ["Utrudnienia", "Linia 4", "Trasa objazdowa"],
    status: "Warning",
    actions: [
      { label: "Więcej informacji", icon: "fa-solid fa-circle-info", type: "primary" },
      { label: "Mapa trasy", icon: "fa-solid fa-map", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Nowe bilety okresowe"
    },
    icon: "fa-solid fa-ticket",
    title: "Nowe bilety miesięczne",
    type: "Promocja i nowe oferty",
    description: "Od kwietnia dostępne są nowe, tańsze bilety miesięczne ze zniżką 10% dla studentów i seniorów. Promocja obowiązuje przez 3 miesiące.",
    metadata: {
      "Obowiązywanie": "01.04.2025",
      "Zniżka dla studentów": "10%",
      "Zniżka dla seniorów": "10%",
      "Ważność": "3 miesiące"
    },
    tags: ["Promocja", "Bilety", "Zniżka"],
    status: "Success",
    actions: [
      { label: "Kup bilet", icon: "fa-solid fa-shopping-cart", type: "primary" },
      { label: "Szczegóły", icon: "fa-solid fa-circle-info", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Rozszerzenie sieci autobusowej"
    },
    icon: "fa-solid fa-bus",
    title: "Nowe linie autobusowe",
    type: "Rozszerzenie sieci",
    description: "Uruchomiliśmy 3 nowe linie autobusowe łączące Kraków z pobliskimi gminami Wieliczką i Tarnowem. Linie będą kursować 7 dni w tygodniu.",
    metadata: {
      "Nowe linie": "L100, L101, L102",
      "Kierunek": "Kraków - Wieliczka - Tarnów",
      "Start": "01.05.2025",
      "Częstotliwość": "Codziennie"
    },
    tags: ["Nowe linie", "Autobusy", "Rozszerzenie"],
    status: "Success",
    actions: [
      { label: "Rozkład jazdy", icon: "fa-solid fa-clock", type: "primary" },
      { label: "Mapa linii", icon: "fa-solid fa-map", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Zakupy nowych tramwajów"
    },
    icon: "fa-solid fa-train",
    title: "Zakup nowych tramwajów Pesa",
    type: "Inwestycje i modernizacja",
    description: "MPK Kraków zamówił 20 nowoczesnych tramwajów Pesa, które będą stopniowo wdrażane od 2025 roku. Tramwaje posiadają system klimatyzacji i bezpłatne WiFi.",
    metadata: {
      "Liczba tramwajów": "20",
      "Producent": "Pesa",
      "Wdrożenie": "2025-2026",
      "Wyposażenie": "Klimatyzacja, WiFi"
    },
    tags: ["Inwestycja", "Tramwaje", "Modernizacja"],
    status: "Success",
    actions: [
      { label: "Galeria", icon: "fa-solid fa-images", type: "primary" },
      { label: "Specyfikacja", icon: "fa-solid fa-circle-info", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Bezpłatny transport dla seniora"
    },
    icon: "fa-solid fa-heart",
    title: "Transport bezpłatny dla seniorów",
    type: "Program społeczny",
    description: "Od maja seniorzy powyżej 70 lat mogą korzystać z komunikacji miejskiej całkowicie bezpłatnie. Wystarczy przedłożyć dowód osobisty.",
    metadata: {
      "Wiek kwalifikujący": "70+",
      "Koszt": "Bezpłatnie",
      "Start": "01.05.2025",
      "Dokumenty": "Dowód osobisty"
    },
    tags: ["Program społeczny", "Seniorzy", "Bezpłatnie"],
    status: "Success",
    actions: [
      { label: "Warunki programu", icon: "fa-solid fa-circle-info", type: "primary" },
      { label: "Rejestracja", icon: "fa-solid fa-user-plus", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Aplikacja mobilna MPK"
    },
    icon: "fa-solid fa-mobile",
    title: "Nowa wersja aplikacji MPK",
    type: "Technologia",
    description: "Właśnie wydaliśmy nową wersję aplikacji MPK z śledzeniem pojazdu w czasie rzeczywistym i alertami o zmianach rozkładu. Aplikacja dostępna na iOS i Android.",
    metadata: {
      "Wersja": "2.0",
      "Platformy": "iOS, Android",
      "Nowe funkcje": "Śledzenie, Alerty, Zakup biletów",
      "Data wydania": "Marzec 2025"
    },
    tags: ["Aplikacja", "Technologia", "Nowe funkcje"],
    status: "Success",
    actions: [
      { label: "Pobierz app", icon: "fa-solid fa-download", type: "primary" },
      { label: "Nowości", icon: "fa-solid fa-circle-info", type: "secondary" }
    ]
  },
  {
    img: {
      src: "https://mpk.krakow.pl/media/photos/6945/l.jpg",
      alt: "Zwiększenie częstotliwości"
    },
    icon: "fa-solid fa-bolt",
    title: "Zwiększona częstotliwość linii 15",
    type: "Ulepszanie usług",
    description: "Ze względu na duże zainteresowanie pasażerów, tramwaj linii 15 będzie kursować co 4 minuty zamiast co 6. Poprawi to dostępność dla podróżnych.",
    metadata: {
      "Linia": "15",
      "Dotychczasowy interval": "6 minut",
      "Nowy interval": "4 minuty",
      "Data zmiany": "15.03.2025"
    },
    tags: ["Linia 15", "Częstotliwość", "Ulepszenie"],
    status: "Success",
    actions: [
      { label: "Nowy rozkład", icon: "fa-solid fa-clock", type: "primary" },
      { label: "Więcej detali", icon: "fa-solid fa-circle-info", type: "secondary" }
    ]
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
    component: markRaw(Announcement),
    componentData: data,
  });
}
</script>


<template>
  <main>
    <Gallery :images="imageList" />
    <Text id="communication" :title="t('sections.communication')" style="background-color: var(--background-main)" />
    <CardsSlider :data="communicationData" @click="cardClick" :t="t" />
    <Text id="qa" :title="t('sections.qa')" style="background-color: var(--background-main)" />
    <Cards :cards="qaList" :t="t" />
    <Text id="map" :title="t('sections.map')" style="background-color: var(--background-main)" />
    <BigImage src="img/interactive-map.jpg" style="padding: 30px;" />
    <Contact id="contact" :title="t('sections.contact')" style="background-color: var(--background-additional)"
      email="mpk@uj.edu.com" phone="+48 123 456 789" />
  </main>
</template>
