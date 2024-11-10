<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <CreateRoomDialog/>
            <p>
               Room List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                       variant="solo-filled" flat hide-details single-line>
         </v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table :headers="headers" item-value="name"  v-model:search="search" :items="RoomList">
         <template v-slot:item.actions="{ item }">
            <div class="_flex _gap-3 ">
               <UpdateRoomDialog :room-selected="item"/>
            </div>
         </template>
      </v-data-table>
   </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoom , exeGlobalGetRooms} from "@/api/useRoom";
import moment from "moment";
import {roomState} from "@/stats/roomState";
import CreateRoomDialog from "@/views/dashboard/room/RoomDialog/CreateRoomDialog.vue";
import UpdateRoomDialog from "@/views/dashboard/room/RoomDialog/UpdateRoomDialog.vue";

const {useGetRooms , useCreateRoom} = useRoom();

const{
   execute: exeGetRooms,
   onResultSuccess: onSuccessGetRooms,
} = useGetRooms();
const search = ref("")
const {RoomList } = roomState();
const headers = [
   {title: 'id', align: 'start', sortable: false, key: 'id',},
   {title: 'Name', key: 'name'},
   {title: 'Capacity', key: 'capacity'},
   {title: 'Notes', key: 'notes'},
   {title: 'Created At', key: 'created_at'},
   {title: 'Actions', key: 'actions', sortable: false},
]
onMounted(() => {
   exeGlobalGetRooms();
})
// exeGetRooms();
// onSuccessGetRooms((res:any) => {
//    RoomList.value = res.data.map((item: any) => {
//       return {
//          id: item.id,
//          name: item.name,
//          capacity: item.capacity,
//          note: item.note,
//          created_at: moment(item.created_at).format('YYYY-MM-DD'),
//       }
//    });
// })
</script>
