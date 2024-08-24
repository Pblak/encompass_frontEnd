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
         <!--         <v-dialog v-model="toggleDialog" scrollable width="auto">-->
         <!--            <v-card prepend-icon="fa-duotone fa-trumpet" width="600">-->
         <!--               <template v-slot:title>-->
         <!--                  {{ dialogEdit ? 'Edit Instrument' : 'New Instrument' }}-->
         <!--               </template>-->
         
         <!--               <template v-slot:append>-->
         <!--                  <v-btn flat icon="fa fa-times" size="small" @click="toggleDialog=false"></v-btn>-->
         <!--               </template>-->
         
         <!--               <template v-slot:text>-->
         <!--                  <v-form  ref="formEl">-->
         <!--                     <v-img v-if="selectedInstrument.image &&-->
         <!--                        selectedInstrument.image !== 'undefined' && selectedInstrument.image !== 'null'"-->
         <!--                            :src="APP_URL+selectedInstrument.image" contain height="200px">-->
         <!--                     </v-img>-->
         <!--                     <v-text-field v-model="selectedInstrument.name" label="Name" outlined></v-text-field>-->
         
         <!--                     <v-file-input-->
         <!--                       v-model="selectedInstrument.newImage as File"-->
         <!--                       label="Select your image"-->
         <!--                       placeholder="Select your image"-->
         <!--                       prepend-icon=""-->
         <!--                       show-size>-->
         <!--                        <template v-slot:selection="{ fileNames }">-->
         <!--                           <template v-for="fileName in fileNames" :key="fileName">-->
         <!--                              <v-chip class="me-2" color="primary" label size="small">-->
         <!--                                 {{ fileName }}-->
         <!--                              </v-chip>-->
         <!--                           </template>-->
         <!--                        </template>-->
         <!--                     </v-file-input>-->
         
         <!--                     <v-row>-->
         <!--                        <v-col class="_flex _items-center _gap-2" cols="12">-->
         <!--                           <v-btn color="primary" icon @click="addPlan(true)">-->
         <!--                              <v-icon>fa-solid fa-plus</v-icon>-->
         <!--                           </v-btn>-->
         <!--                           <p>Add new plan</p>-->
         <!--                        </v-col>-->
         <!--                        <v-col v-for="(plan,) in selectedInstrument.plans" cols="6">-->
         <!--                           <v-card>-->
         <!--                              <v-card-title class="">-->
         <!--                                 <div class="_flex _justify-end">-->
         <!--                                    <v-btn :disabled="selectedInstrument.plans && selectedInstrument?.plans.length <= 1"-->
         <!--                                           color="red"-->
         <!--                                           density="compact" icon-->
         <!--                                           @click="removePlan(plan,true)">-->
         <!--                                       <v-icon size="12">fa-duotone fa-trash</v-icon>-->
         <!--                                    </v-btn>-->
         <!--                                 </div>-->
         <!--                              </v-card-title>-->
         <!--                              <v-card-text>-->
         <!--                                 <v-text-field v-model="plan.name" :rules="namePlanRules"-->
         <!--                                               density="compact" label="Name" variant="solo-filled"></v-text-field>-->
         <!--                                 <v-text-field v-model="plan.duration" :rules="durationPlanRules"-->
         <!--                                               density="compact" label="Duration" variant="solo-filled"></v-text-field>-->
         <!--                                 <v-text-field v-model="plan.price" :rules="pricePlanRules"-->
         <!--                                               density="compact" label="Price" variant="solo-filled"></v-text-field>-->
         <!--                              </v-card-text>-->
         <!--                           </v-card>-->
         <!--                        </v-col>-->
         <!--                     </v-row>-->
         
         <!--                  </v-form>-->
         <!--               </template>-->
         <!--               <template v-slot:actions>-->
         <!--                  <v-btn :text="dialogEdit ? 'Update' : 'Save'" class="ms-auto"-->
         <!--                         variant="tonal" @click="saveForm"></v-btn>-->
         <!--               </template>-->
         <!--            </v-card>-->
         <!--         </v-dialog>-->
      </v-card-title>
      <v-divider></v-divider>
      <v-lazy :min-height="200" :options="{'threshold':0.5}" transition="fade-transition">
         <v-row class="_py-4 _px-2">
            <v-col v-for="item in InstrumentList.filter((res:any)  => res.name.includes(search))" :key="item.id"
                   cols="12" lg="3" md="3" sm="4">
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
