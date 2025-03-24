<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar :elevation="0" color="transparent">
      <v-app-bar-title>
        <router-link :to="{ name: 'landing' }">Home</router-link>
      </v-app-bar-title>

      <template v-slot:append>
        <!--        <v-btn icon="mdi-heart" to="/login"></v-btn>-->
        <div class="d-flex align-center px-12 _gap-4">

          <v-btn to="/login" variant="flat" color="primary">
            login
          </v-btn>
          <v-btn to="/register" variant="flat" color="green">
            register
          </v-btn>
        </div>

        <!--        <v-btn icon="mdi-dots-vertical"></v-btn>-->
      </template>
    </v-app-bar>


    <!-- Main Content -->

    <v-main class="_bg-no-repeat _bg-cover _bg-center "  >
      <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
        <h1 class="text-h2 font-weight-bold mb-4">Welcome to Encompass </h1>
        <p class="text-body-1 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias culpa eligendi
          maiores modi optio pariatur rerum soluta vero voluptate!
        </p>
        <v-btn color="primary" size="x-large" to="/register">Get Started</v-btn>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="text-center py-3" color="grey-lighten-4">
      <v-container>
        &copy; {{ new Date().getFullYear() }} Your Company Name
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>

const APP_URL = import.meta.env.VITE_APP_URL;
</script>

<style>
.fill-height {
  min-height: 80vh;
}
</style>
