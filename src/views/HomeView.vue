<script setup lang="ts">
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Home</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  to="/login">Login</v-btn>
      <v-btn  to="/register">Register</v-btn>
    </v-app-bar>
     <v-main>
        <router-view />
     </v-main>
  </v-app>
</template>
