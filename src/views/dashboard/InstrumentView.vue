<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <v-btn color="primary" icon="fa fa-plus"
                   @click="openDialog()"></v-btn>
            <p>
               Instruments List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" flat
                       hide-details label="Search" prepend-inner-icon="fa-thin fa-search" single-line
                       variant="solo-filled">
         </v-text-field>
         <v-dialog v-model="toggleDialog" scrollable width="auto">
            <v-card prepend-icon="fa-duotone fa-trumpet" width="600">
               <template v-slot:title>
                  {{ dialogEdit ? 'Edit Instrument' : 'New Instrument' }}
               </template>
               <template v-slot:append>
                  <v-btn flat icon="fa fa-times" size="small" @click="toggleDialog=false"></v-btn>
               </template>
               
               <template v-slot:text>
                  <v-form v-if="!dialogEdit">
                     <v-text-field v-model="newInstrument.name" label="Name" outlined></v-text-field>
                     <v-file-input
                       v-model="newInstrument.image as File"
                       label="Select your image"
                       placeholder="Select your image"
                       prepend-icon=""
                       show-size>
                        <template v-slot:selection="{ fileNames }">
                           <template v-for="fileName in fileNames" :key="fileName">
                              <v-chip
                                class="me-2"
                                color="primary"
                                label
                                size="small">
                                 {{ fileName }}
                              </v-chip>
                           </template>
                        </template>
                     </v-file-input>
                  </v-form>
                  <v-form v-else>
                     <v-img v-if="selectedInstrument.image &&
                        selectedInstrument.image !== 'undefined' && selectedInstrument.image !== 'null'"
                            :src="APP_URL+selectedInstrument.image" contain height="200px">
                     </v-img>
                     <v-text-field v-model="selectedInstrument.name" label="Name" outlined></v-text-field>
                     <v-file-input
                       v-model="selectedInstrument.newImage as File"
                       label="Select your image"
                       placeholder="Select your image"
                       prepend-icon=""
                       show-size>
                        <template v-slot:selection="{ fileNames }">
                           <template v-for="fileName in fileNames" :key="fileName">
                              <v-chip
                                class="me-2"
                                color="primary"
                                label
                                size="small"
                              >
                                 {{ fileName }}
                              </v-chip>
                           </template>
                        </template>
                     </v-file-input>
                  </v-form>
               </template>
               <template v-slot:actions>
                  <v-btn :text="dialogEdit ? 'Update' : 'Save'" class="ms-auto"
                         @click="saveForm"></v-btn>
               </template>
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-lazy :min-height="200" :options="{'threshold':0.5}" transition="fade-transition" >
         <v-row class="_py-4 _px-2">
            <v-col v-for="item in InstrumentList.filter((res:any)  => res.name.includes(search))" :key="item.id"
                   cols="12" lg="3" md="3" sm="4">
               <v-card>
                  <v-lazy>
                     <v-img
                       :src="APP_URL+item.image"
                       class="align-end"
                       contain
                       gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)" height="130px">
                        <v-card-title class="text-white !_capitalize">{{ item.name }}</v-card-title>
                        <template v-slot:error>
                           <v-img
                             class="mx-auto"
                             height="130px"
                             max-width="500"
                             :src="APP_URL+item.image"
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
                       @click="openDialog(item)"
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
import {useInstrument} from "@/api/useInstrument";

import moment from "moment";
import {instrumentState} from "@/stats/instrumentState";

interface NewInstrument {
   name: string,
   image?: File | null,
}

interface Instrument {
   id: string,
   name: string,
   image: string,
   newImage?: File | null,
   created_at: string,
}

const APP_URL = import.meta.env.VITE_APP_URL;
const {useGetInstruments, useCreateInstrument, useUpdateInstrument} = useInstrument();

const {
   execute: exeCreateInstrument,
   onResultSuccess: onSuccessCreateInstrument,
} = useCreateInstrument()

const {
   execute: exeGetInstruments,
   onResultSuccess: onSuccessGetInstruments,
} = useGetInstruments();

const {
   execute: exeUpdateInstrument,
   onResultSuccess: onSuccessUpdateInstrument,
} = useUpdateInstrument();

const {InstrumentList} = instrumentState();
const toggleDialog = ref(false)
const dialogEdit = ref(false)
const search = ref("")
const newInstrument = ref<NewInstrument>({
   name: "",
   image: null,
})

const openDialog = (item = null,) => {
   if (item === null) {
      dialogEdit.value = false;
      toggleDialog.value = true;
   } else {
      selectedInstrument.value = item;
      dialogEdit.value = true;
      toggleDialog.value = true;
   }
}
const selectedInstrument = ref<Instrument>({
   id: "",
   name: "",
   image: "",
   newImage: null,
   created_at: "",
})
const saveForm = () => {
   if (dialogEdit.value) {
      exeUpdateInstrument({
         data: selectedInstrument.value,
      })
   } else {
      const formData = new FormData();
      formData.append('name', newInstrument.value.name);
      formData.append('image', newInstrument.value.image as File);
      exeCreateInstrument({data: formData})
   }
}

onMounted(() => {
   exeGetInstruments()
})
onSuccessGetInstruments((res: any) => {
   InstrumentList.value = res.data.map((item: any) => {
      return {
         id: item.id,
         name: item.name,
         image: item.image,
         teachers: item.teachers,
         created_at: moment(item.created_at).format("YYYY-MM-DD"),
      }
   });
})
onSuccessCreateInstrument(() => {
   newInstrument.value = {
      name: "",
      image: null,
   }
   toggleDialog.value = false;
   exeGetInstruments()
})
onSuccessUpdateInstrument(() => {
   selectedInstrument.value = {
      id: "",
      name: "",
      image: "",
      newImage: null,
      created_at: "",
   }
   toggleDialog.value = false;
   exeGetInstruments()
})

</script>