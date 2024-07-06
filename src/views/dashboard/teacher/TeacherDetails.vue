<script lang="ts" setup>
import {teacherState} from "@/stats/teacherState";
import {instrumentState} from "@/stats/instrumentState";
import {useTeacher} from "@/api/useTeacher";
import {useInstrument} from "@/api/useInstrument";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";

const route = useRoute();
const teacher_id = route.params.teacher_id;
const APP_URL = import.meta.env.VITE_APP_URL;

const {TeacherList} = teacherState();
const {InstrumentList} = instrumentState();
const {useGetTeachers, useUpdateTeacher, useCreateTeacher} = useTeacher();
const {useGetInstruments, useUpdateInstrument, useCreateInstrument} = useInstrument();

const Teacher = TeacherList.value.find((teacher: any) => teacher.id === parseInt(teacher_id as string))
const searchInstrument = ref("")

const filterInstruments = computed(() => {
   return InstrumentList.value.filter((res: any) => {
      // find the instrument that matches this instrument in teacher's instrument
      return res.name.includes(searchInstrument.value) && !Teacher.instruments.find((ins: any) => ins.id === res.id)
   })
})

const addInstrumentToTeacher =(item :any)=>{
   
   Teacher.instruments.push(item)
   console.log(Teacher.instruments)
}
const canRemoveInstrument = computed(() => {
   /**
    * problem for future me
    */
   return Teacher.instruments.length > 0
})

const RemoveInstrumentFromTeacher = (item: any) => {
   console.log(item)
   Teacher.instruments = Teacher.instruments.filter((res: any) => res.id !== item.id)
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
            
            <template v-slot:title>{{ Teacher.name }}</template>
            <template v-slot:subtitle>{{ Teacher.email }}</template>
            
            <template v-slot:append>
               <v-btn
                 class="text-none"
                 color="primary"
                 slim
                 text="Create goal"
                 variant="text"
               ></v-btn>
            </template>
         </v-list-item>
         
         <v-divider></v-divider>
         
         <v-card-text>
            <v-row>
               <v-col cols="6">
                  <p class="text-h6">Phone Numbers</p>
                  <p>{{ Teacher.infos.phone1 }}</p>
                  <p>{{ Teacher.infos.phone2 }}</p>
               </v-col>
               
               <v-col cols="6">
                  
                  <p class="text-h6">Address</p>
                  <p>{{ Teacher.infos.address.street }}</p>
                  <p>{{ Teacher.infos.address.city }}, {{ Teacher.infos.address.state }} {{
                        Teacher.infos.address.zip
                     }}</p>
               </v-col>
            </v-row>
         
         
         </v-card-text>
         <v-card-actions>
            <v-card-subtitle>Timestamps</v-card-subtitle>
         </v-card-actions>
      </v-card>
      <v-row>
         <v-col cols="5">
            <v-card>
               <v-card-item class="">
                  <v-text-field v-model="searchInstrument" hide-details
                                label="Search from your Instrument" show-size variant="underlined"></v-text-field>
               </v-card-item>
               <v-card-text style="overflow-y: auto">
                  <div v-if="Teacher.instruments.length===0">
                     <v-alert
                       color="warning"
                       variant="outlined">
                        <template v-slot:title>
                           This teacher teaches no instrument
                        </template>
                     </v-alert>
                  </div>
                  <v-row class="_py-4 _px-2">
                     <v-col
                       v-for="item in Teacher.instruments.filter((res:any)  => res.name.includes(searchInstrument))"
                       :key="item.id" cols="12" lg="6" md="5" sm="4">
                        <v-card>
                           <v-lazy>
                              <v-img
                                :src="APP_URL+item.image"
                                class="align-end"
                                contain
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)" height="130px">
                                 <v-card-title class="text-white !_capitalize">
                                    <v-btn color="error" density="compact" icon
                                           @click="RemoveInstrumentFromTeacher(item)"
                                           v-if="canRemoveInstrument">
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
         
         <v-col cols="7">
            <v-card>
               <v-card-item class=" ">
                  <v-text-field v-model="searchInstrument" hide-details
                                label="Search in global Instrument" show-size variant="underlined"></v-text-field>
               </v-card-item>
               <v-card-text>
                  <v-row class="_py-4 _px-2">
                     <v-col v-for="item in filterInstruments" :key="item.id" cols="12" lg="3" md="4" sm="6">
                        <v-card>
                           <v-lazy>
                              <v-img :src="APP_URL+item.image"
                                class="align-end" contain gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                                height="130px">
                                 <v-card-title class="text-white !_capitalize">
                                    <v-btn color="primary" density="compact" icon @click="addInstrumentToTeacher(item)">
                                       <v-tooltip activator="parent" location="bottom" >
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