<script lang="ts" setup>
import {studentState} from "@/stats/studentState";
import {instrumentState} from "@/stats/instrumentState";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";

const route = useRoute();
const student_id = route.params.student_id;
const APP_URL = import.meta.env.VITE_APP_URL;

const {StudentList} = studentState();
const {InstrumentList} = instrumentState();

const Student = StudentList.value.find((student: any) => student.id === parseInt(student_id as string))
const searchGlobalInstrument = ref("")
const searchInstrument = ref("")

const filterInstruments = computed(() => {
   return InstrumentList.value.filter((res: any) => {
      // find the instrument that matches this instrument in teacher's instrument
      return res.name.includes(searchInstrument.value) && !Student.instruments.find((ins: any) => ins.id === res.id)
   })
})
const filterGlobalInstruments = computed(() => {
   return InstrumentList.value.filter((res: any) => {
      // find the instrument that matches this instrument in teacher's instrument
      return res.name.includes(searchGlobalInstrument.value) && !Student.instruments.find((ins: any) => ins.id === res.id)
   })
})
const RemoveInstrumentFromStudent = (item: any) => {
   Student.instruments = Student.instruments.filter((res: any) => res.id !== item.id)
}
const addInstrumentToStudent = (item: any) => {
   Student.instruments.push(item)
}
</script>

<template>
   <div class="_flex _flex-col _gap-4">
      <v-card>
         <v-list-item>
            <template v-slot:prepend>
               <v-avatar color="surface-light" size="60">
                  <v-img
                    alt="John"
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
               </v-avatar>
            </template>
            
            <template v-slot:title>{{ Student.name }}</template>
            <template v-slot:subtitle>{{ Student.email }}</template>
            
            <template v-slot:append>
               <p class="_font-black _text-gray-600"> Student</p>
            </template>
         </v-list-item>
         <v-divider></v-divider>
         
         <v-card-text>
            <v-row>
               <v-col cols="6">
                  <p class="text-h6">Phone Numbers</p>
                  <p>{{ Student.infos.phone }}</p>
               </v-col>
               <v-col cols="6">
                  <p class="text-h6">Address</p>
                  <p>{{ Student.infos.address.street }}</p>
                  <p>{{ Student.infos.address.city }}, {{ Student.infos.address.state }} {{
                        Student.infos.address.zip
                     }}</p>
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions>
            <v-card-subtitle>Timestamps</v-card-subtitle>
         </v-card-actions>
      </v-card>
      <v-row>
         <v-col cols="6">
            <v-card color="surface-light">
               <v-card-item class="">
                  <v-text-field v-model="searchInstrument"
                                append-inner-icon="fa fa-search" density="compact"
                                hide-details label="Search from your Instrument"
                                single-line variant="solo" ></v-text-field>
               </v-card-item>
               <v-card-text style="overflow-y: auto">
                  <div v-if="Student.instruments.length===0">
                     <v-alert color="primary" variant="outlined">
                        <template v-slot:title>
                           <div class="_text-center w-100">This student has no instrument</div>
                        </template>
                     </v-alert>
                  </div>
                  <v-row class="_py-4">
                     <v-col v-for="item in Student.instruments.filter((res:any)=> res.name.includes(searchInstrument))"
                            :key="item.id" cols="12" lg="4" md="3" sm="6">
                        <v-card>
                           <v-lazy>
                              <v-img :src="APP_URL+item.image" class="align-end" contain
                                     gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                                     height="130px">
                                 <v-card-title class="text-white !_capitalize">
                                    <v-btn color="error" density="compact"
                                           icon @click="RemoveInstrumentFromStudent(item)">
                                       <v-icon class="fa fa-minus" size="14"></v-icon>
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
                     </v-col>
                  </v-row>
               </v-card-text>
            </v-card>
         </v-col>
         
         <v-col cols="6">
            <v-card color="surface-light">
               <v-card-item  >
                  <v-text-field v-model="searchGlobalInstrument"
                                append-inner-icon="fa fa-search" density="compact" hide-details
                                label="Search in global Instrument"
                                single-line variant="solo"
                  ></v-text-field>
               </v-card-item>
               <v-card-text>
                  <v-row class="_py-4 ">
                     <v-col v-for="item in filterGlobalInstruments" :key="item.id" cols="12" lg="4" md="4" sm="6">
                        <v-card>
                           <v-lazy>
                              <v-img :src="APP_URL+item.image"
                                     class="align-end" contain gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                                     height="130px">
                                 <v-card-title class="text-white !_capitalize">
                                    <v-btn color="primary" density="compact" icon
                                           @click="addInstrumentToStudent(item)">
                                       <v-tooltip activator="parent" location="bottom">
                                          {{ item.name }}
                                       </v-tooltip>
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
                     </v-col>
                  </v-row>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>
</template>