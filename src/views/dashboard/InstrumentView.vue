<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <CreateInstrumentDialog />
            <p>
               Instruments List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" flat hide-details label="Search"
                       prepend-inner-icon="fa-thin fa-search" single-line variant="solo-filled">
         </v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <v-lazy :min-height="200" :options="{'threshold':0.5}" transition="fade-transition">
         <v-row class="_py-4 _px-2">
            <v-col v-for="item in InstrumentList.filter((res:any)  => res.name.includes(search))" :key="item.id"
                   cols="12" lg="2" md="3" sm="4">
               <v-card>
                  <v-lazy>
                     <v-img :src="APP_URL+item.image" class="align-end" contain
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                            height="130px">
                        <v-card-title class="text-white !_capitalize">{{ item.name }}</v-card-title>
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
                  <v-card-actions>
                     <v-btn
                       color="red-darken-2"
                       icon="fa fa-heart"
                       size="small">
                     </v-btn>

                     <v-btn
                       icon="fa-duotone fa-bookmark"
                       size="small"
                     ></v-btn>

                     <v-btn
                       color="orange-darken-2"
                       icon="fa-duotone fa-edit"
                       size="small"
                       @click="editInstrument(item)"
                     ></v-btn>
                  </v-card-actions>
               </v-card>
            </v-col>
         </v-row>
      </v-lazy>
   </v-card>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {exeGlobalGetInstruments, useInstrument} from "@/api/useInstrument";
import {instrumentState, InstrumentType} from "@/stats/instrumentState";
import CreateInstrumentDialog from "@/views/dashboard/instrument/instrumentDialog/CreateInstrumentDialog.vue";

const APP_URL = import.meta.env.VITE_APP_URL;
const {InstrumentList, selectedInstrument, instrumentDialog} = instrumentState();
const createInstrument = ref(true)
const search = ref("")

const editInstrument = (item: InstrumentType) => {
   instrumentDialog.value = true;
   selectedInstrument.value = item;
   if(!selectedInstrument.value.plans) selectedInstrument.value.plans = []
   createInstrument.value = false;
}
onMounted(() => {
   exeGlobalGetInstruments()
})

</script>
