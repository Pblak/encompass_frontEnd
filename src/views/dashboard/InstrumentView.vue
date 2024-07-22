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
                  <v-form v-if="!dialogEdit" ref="formEl">
                     <v-text-field v-model="newInstrument.name" :rules="nameInstrumentRules"
                                   label="Name" outlined></v-text-field>
                     <v-file-input
                       v-model="newInstrument.image as File"
                       :rules="[v => !!v || 'Image is required']"
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
                     <v-row>
                        <v-col class="_flex _items-center _gap-2" cols="12">
                           <v-btn color="primary" icon @click="addPlan()">
                              <v-icon>fa-solid fa-plus</v-icon>
                           </v-btn>
                           <p>Add new plan</p>
                        </v-col>
                        <v-col v-for="(plan,index) in newInstrument.plans" cols="6">
                           <v-card>
                              <v-card-title class="">
                                 <div class="_flex _justify-end">
                                    <v-btn :disabled="newInstrument.plans.length <= 1" color="red" density="compact"
                                           icon
                                           @click="removePlan(plan)">
                                       <v-icon size="12">fa-duotone fa-trash</v-icon>
                                    </v-btn>
                                 </div>
                              </v-card-title>
                              <v-card-text>
                                 <v-text-field v-model="plan.name" :rules="namePlanRules"
                                               density="compact" label="Name" variant="solo-filled"></v-text-field>
                                 <v-text-field v-model="plan.duration" :rules="durationPlanRules"
                                               density="compact" label="Duration" variant="solo-filled"></v-text-field>
                                 
                                 <v-text-field v-model="plan.price" :rules="pricePlanRules"
                                               density="compact" label="Price" variant="solo-filled"></v-text-field>
                              </v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-form>
                  <v-form v-else ref="formEl">
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
                              <v-chip class="me-2" color="primary" label size="small">
                                 {{ fileName }}
                              </v-chip>
                           </template>
                        </template>
                     </v-file-input>
                     
                     <v-row>
                        <v-col class="_flex _items-center _gap-2" cols="12">
                           <v-btn color="primary" icon @click="addPlan(true)">
                              <v-icon>fa-solid fa-plus</v-icon>
                           </v-btn>
                           <p>Add new plan</p>
                        </v-col>
                        <v-col v-for="(plan,index) in selectedInstrument.plans" cols="6">
                           <v-card>
                              <v-card-title class="">
                                 <div class="_flex _justify-end">
                                    <v-btn :disabled="selectedInstrument.plans && selectedInstrument?.plans.length <= 1"
                                           color="red"
                                           density="compact" icon
                                           @click="removePlan(plan,true)">
                                       <v-icon size="12">fa-duotone fa-trash</v-icon>
                                    </v-btn>
                                 </div>
                              </v-card-title>
                              <v-card-text>
                                 <v-text-field v-model="plan.name" :rules="namePlanRules"
                                               density="compact" label="Name" variant="solo-filled"></v-text-field>
                                 <v-text-field v-model="plan.duration" :rules="durationPlanRules"
                                               density="compact" label="Duration" variant="solo-filled"></v-text-field>
                                 <v-text-field v-model="plan.price" :rules="pricePlanRules"
                                               density="compact" label="Price" variant="solo-filled"></v-text-field>
                              </v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  
                  </v-form>
               </template>
               <template v-slot:actions>
                  <v-btn :text="dialogEdit ? 'Update' : 'Save'" class="ms-auto"
                         variant="tonal" @click="saveForm"></v-btn>
               </template>
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-lazy :min-height="200" :options="{'threshold':0.5}" transition="fade-transition">
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
import {instrumentState} from "@/stats/instrumentState";

interface NewInstrument {
   name: string,
   image?: File | null,
   plans: Plans[],
}

interface Plans {
   id: number
   name: string
   duration: string,
   price: string,
}

interface Instrument {
   id: string,
   name: string,
   image: string,
   newImage?: File | null,
   plans: Plans[],
   created_at: string,
}

const APP_URL = import.meta.env.VITE_APP_URL;
const {useGetInstruments, useCreateInstrument, useUpdateInstrument} = useInstrument();
const formEl = ref(null)
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
   plans: [] as Plans[],
})
newInstrument.value.plans = [
   {
      id: 1,
      name: "",
      duration: "",
      price: "",
   },
]
const addPlan = (editing = false) => {
   if (!editing) {
      if (newInstrument.value.plans && newInstrument.value.plans.length >= 3) return
      let id = newInstrument.value.plans[newInstrument.value.plans.length - 1].id + 1
      newInstrument.value.plans.push({
         id: id,
         name: "",
         duration: "",
         price: "",
      })
   } else {
      if (selectedInstrument.value.plans.length >= 3) return
      // create plan id from existing plan id
      let id = selectedInstrument.value.plans[selectedInstrument.value.plans.length - 1].id  + 1
      selectedInstrument.value.plans.push({
         id: id,
         name: "",
         duration: "",
         price: "",
      })
   }
}
const removePlan = (plan: Plans, editing = false) => {
   if (!editing) {
      if (!newInstrument.value.plans)
         if (newInstrument.value.plans.length  <= 1) return
      newInstrument.value.plans.splice(newInstrument.value.plans.indexOf(plan), 1)
      newInstrument.value.plans.forEach((item, index) => {
         item.id = index + 1
      })
   } else {
      if (selectedInstrument.value.plans.length <= 1) return
      selectedInstrument.value.plans.splice(selectedInstrument.value.plans.indexOf(plan), 1)
      
      //  adjust the id of  each plan remaining
      selectedInstrument.value.plans.forEach((item, index) => {
         item.id = index + 1
      })
      
   }
}
const openDialog = (item = null,) => {
   if (item === null) {
      dialogEdit.value = false;
      toggleDialog.value = true;
   } else {
      selectedInstrument.value = item;
      if (!selectedInstrument.value.plans) selectedInstrument.value.plans = []
      dialogEdit.value = true;
      toggleDialog.value = true;
   }
}
const selectedInstrument = ref<Instrument>({
   id: "",
   name: "",
   image: "",
   plans: [] as Plans[],
   newImage: null,
   created_at: "",
})
const saveForm = async () => {
   if (!formEl.value) return
   const {valid} = await formEl.value.validate()
   if (!valid) return
   if (dialogEdit.value) {
      await exeUpdateInstrument({
         data: selectedInstrument.value,
      })
   } else {
      // const formData = new FormData();
      // formData.append('name', newInstrument.value.name);
      // formData.append('plans', JSON.stringify(newInstrument.value.plans));
      // formData.append('image', newInstrument.value.image as File);
      await exeCreateInstrument({data: newInstrument.value})
   }
}

onMounted(() => {
   
   exeGetInstruments()
})
onSuccessGetInstruments((res: any) => {
   InstrumentList.value = res.data.map((item: any) => {
      return item
   });
})
onSuccessCreateInstrument(() => {
   newInstrument.value = {
      name: "",
      image: null,
      plans: [
         {
            id: 1,
            name: "",
            duration: "",
            price: "",
         },
      ],
   }
   toggleDialog.value = false;
   exeGetInstruments()
})
onSuccessUpdateInstrument(() => {
   selectedInstrument.value = {
      id: "",
      name: "",
      image: "",
      plans: [] as Plans[],
      newImage: null,
      created_at: "",
   }
   toggleDialog.value = false;
   exeGetInstruments()
})

const nameInstrumentRules = [
   (v: any ) => !!v || 'Name is required',
   (v: any ) => (v && v.length <= 10) || 'Name must be less than 10 characters',
]

const namePlanRules = [
   (v: string ) => !!v || 'Name is required',
   (v: string )=> (v && v.length <= 10) || 'Name must be less than 10 characters',
]
// duration must be a number
const durationPlanRules = [
   (v: number ) => !!v || 'Duration is required',
   (v: number ) => !isNaN(Number(v)) || 'Duration must be a number',
]
// price must be a number
const pricePlanRules = [
   (v: number ) => !!v || 'Price is required',
   (v: number ) => !isNaN(Number(v)) || 'Price must be a number',
]

</script>