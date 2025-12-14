<script setup>
defineProps({
  title: String,
  email: String,
  phone: String,
  facebookLink: String,
  instagramLink: String,
});
</script>

<template>
  <section>
    <h1>{{ title }}</h1>
    <div class="contact-container">
      <ul class="contact-list">
        <li>
          <a>
            <i class="fa-solid fa-phone"></i>
            <div class="contact-info">
              <h2>TELEFON</h2>
              <span> {{ phone }}</span>
            </div>
          </a>
        </li>
        <li>
          <a>
            <i class="fa-solid fa-envelope"></i>
            <div class="contact-info">
              <h2>EMAIL</h2>
              <span>{{ email }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div v-if="facebookLink || instagramLink" class="social-media">
      <a :href="facebookLink" target="_blank"><i class="fa-brands fa-facebook"></i></a>
      <a :href="instagramLink" target="_blank"><i class="fa-brands fa-instagram"></i></a>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  flex-direction: column;
  padding: 40px 0 80px 0;
}

section h1 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 40px;
  font-size: clamp(32px, 5vw, 40px);
  font-weight: 700;
  font-family: 'Oswald';
  color: var(--text-primary);
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.contact-list li {
  background: var(--background-secondary);
  padding: 20px;
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--card-shadow);
  transition: transform 0.3s ease;
}

.contact-list li a {
  display: flex;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.contact-list li:hover {
  transform: translateY(-5px);
}

.contact-list i {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 28px;
  color: var(--text-primary);
  margin-right: 10px;
}

.contact-info {
  flex: 1;
  overflow: hidden;
}

.contact-info h2 {
  margin: 0;
  font-size: 18px;
  text-align: left;
  color: var(--text-primary);
  font-family: 'Oswald';
}

.contact-info span {
  color: var(--text-additional);
  font-size: 16px;
  display: block;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.social-media a {
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  font-size: clamp(28px, 5vw, 35px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-media a:hover {
  transform: scale(1.2);
}

.social-media a[href*='facebook']:hover {
  color: #1877f2;
}

.social-media a[href*='instagram']:hover {
  color: #e4405f;
}
</style>
