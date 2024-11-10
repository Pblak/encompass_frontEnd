<template>
  <v-tooltip text="Create room" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" width="auto">
    <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
      <template v-slot:title>
        Create Room
      </template>
      <template v-slot:text>
        <CreateRoomForm :push-data="attemptSave" eventForValidate="create-room-event"></CreateRoomForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import CreateRoomForm from "@/views/dashboard/room/RoomDialog/CreateRoomForm.vue";
import {useRoom, exeGlobalGetRooms} from "@/api/useRoom";
import {useEventBus} from "@vueuse/core";

const {useCreateRoom} = useRoom();
const {onResultSuccess: onSuccessCreateRoom, execute: exeCreateRoom} = useCreateRoom();
const toggleDialog = ref(false)
const {emit} = useEventBus('create-room-event');
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeCreateRoom({
    data: res.data
  });
}
onSuccessCreateRoom(() => {
  toggleDialog.value = false;
  exeGlobalGetRooms();
})
</script>
