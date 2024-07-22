<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <v-tooltip text="Create room" location="bottom">
               <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
               </template>
            </v-tooltip>
            
            <p>
               Room List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                       variant="solo-filled" flat hide-details single-line>
         </v-text-field>
         <v-dialog v-model="toggleDialog" width="auto">
            <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
               <template v-slot:title>
                  Create Room
               </template>
               <template v-slot:text>
                  <v-form @submit.prevent="createRoom" ref="FormEl">
                     <v-text-field variant="solo" density="comfortable"
                                   v-model="formData.name" label="Name" :rules="$rules('required')"></v-text-field>
                     <v-text-field variant="solo" density="comfortable"
                                   v-model="formData.capacity" label="Capacity" :rules="$rules('required')"></v-text-field>
                     
                     <v-textarea
                       variant="solo" density="comfortable"
                       v-model="formData.note"
                       label="note"
                       counter
                       :rules="$rules('max:300')"
                     ></v-textarea>
                     <v-btn color="primary" type="submit">Create</v-btn>
                  </v-form>
               </template>
<!--               <template v-slot:actions>-->
<!--                  <v-btn class="ms-auto" text="Ok" @click="toggleDialog = false"></v-btn>-->
<!--               </template>-->
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table :headers="headers" item-value="name"  v-model:search="search" :items="RoomList">
         <template v-slot:item.actions="{ item }">
            <div class="_flex _gap-3 ">
               <v-btn size="small" icon="fa-thin fa-edit _text-sm" elevation="0"> </v-btn>
               <v-btn size="small" icon="fa-thin fa-calendar _text-sm" elevation="0"> </v-btn>
            </div>
         </template>
      </v-data-table>
   </v-card>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useRoom} from "@/api/useRoom";
import moment from "moment";
import {roomState} from "@/stats/roomState";

const {useGetRooms , useCreateRoom} = useRoom();

const{
   execute: exeGetRooms,
   onResultSuccess: onSuccessGetRooms,
} = useGetRooms();
const{
   execute: exeCreateRoom,
   onResultSuccess: onSuccessCreateRoom,
} = useCreateRoom();
const search = ref("")
const {RoomList } = roomState();
const toggleDialog = ref(false)
const FormEl = ref(null)
const formData = ref({
   name: "",
   capacity: "",
   note: "",
})
const headers = [
   {title: 'id', align: 'start', sortable: false, key: 'id',},
   {title: 'Name', key: 'name'},
   {title: 'Capacity', key: 'capacity'},
   {title: 'Note', key: 'note'},
   {title: 'Created At', key: 'created_at'},
   {title: 'Actions', key: 'actions', sortable: false},
]

const createRoom = async () => {
   // validate form data
   if (!FormEl.value) return;
   let {valid} = await FormEl.value.validate()
   console.log(formData.value , valid);
   if (!valid) return;
   await exeCreateRoom({
      data: formData.value
   });
}

exeGetRooms();
onSuccessGetRooms((res:any) => {
   RoomList.value = res.data.map((item: any) => {
      return {
         id: item.id,
         name: item.name,
         capacity: item.capacity,
         note: item.note,
         created_at: moment(item.created_at).format('YYYY-MM-DD'),
      }
   });
})
onSuccessCreateRoom((res:any) => {
   toggleDialog.value = false;
   exeGetRooms();
})

</script>
