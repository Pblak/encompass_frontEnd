<template>
    <v-tooltip text="Update room" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" density="comfortable" icon="fa fa-edit !_text-sm"
                   @click="toggleDialog = true"></v-btn>
        </template>
    </v-tooltip>
    <v-dialog v-model="toggleDialog" width="auto">
        <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
            <template v-slot:title>
                Update Room
            </template>
            <template v-slot:text>
                <UpdateRoomForm
                    :push-data="attemptSave"
                    eventForValidate="update-room-event"
                    :room-selected="roomSelected"></UpdateRoomForm>
            </template>
            <template v-slot:actions>
                <v-btn class="ms-auto" color="success" text="Update " variant="tonal" @click="sendEvent"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useRoom, exeGlobalGetRooms} from "@/api/useRoom";
import {useEventBus} from "@vueuse/core";
import type {RoomType} from "@/stats/roomState";
import UpdateRoomForm from "@/views/dashboard/room/RoomDialog/UpdateRoomForm.vue";


const {useUpdateRoom} = useRoom();
const {onResultSuccess: onSuccessUpdateRoom, execute: exeUpdateRoom} = useUpdateRoom();
const toggleDialog = ref(false)
const {emit} = useEventBus('update-room-event');
defineProps<{
    roomSelected: RoomType,
}>();
const sendEvent = () => {
    emit();
};

const attemptSave = (res) => {
    exeUpdateRoom({
        data: res.data
    });
}
onSuccessUpdateRoom(() => {
    toggleDialog.value = false;
    exeGlobalGetRooms();
})
</script>
