<template>
   
   <v-layout ref="app" class="rounded rounded-md">
      <v-app-bar color="grey-lighten-2" name="app-bar">
         <v-btn class="mx-auto"  >Get data</v-btn>
      </v-app-bar>
      
      <v-navigation-drawer
        color="grey-darken-2"
        location="end"
        name="drawer"
        permanent
      >
         <div class="d-flex justify-center align-center h-100">
            <v-btn  >Get data</v-btn>
         </div>
      </v-navigation-drawer>
      
      <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
         Main Content
      </v-main>
      
      <v-footer
        name="footer"
        app
      >
         <v-btn
           class="mx-auto"
           variant="text"
         >
            Get data
         </v-btn>
      </v-footer>
   </v-layout>
   
</template>
<script setup lang="ts">
import {useMessage} from "@/api/useMessage";
</script>
