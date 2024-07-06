<script setup lang="ts">
import {ref} from "vue";

const APP_URL = import.meta.env.VITE_APP_URL;
// define the props
const props = defineProps({
   item: {
      type: Object,
      required: true
   }
})


</script>

<template>
   <v-card>
      <v-lazy>
         <v-img
           :src="APP_URL+item.image"
           class="align-end"
           contain
           gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)" height="130px">
            <v-card-title class="text-white !_capitalize">
               <v-btn color="primary" density="compact" icon>
                  <v-icon class="fa fa-plus" size="14"></v-icon>
               </v-btn>
            </v-card-title>
            <template v-slot:error>
               <v-img
                 :src="APP_URL+item.image"
                 class="mx-auto"
                 height="130px"
                 max-width="500"
               ></v-img>
            </template>
         </v-img>
      </v-lazy>
   </v-card>
</template>
