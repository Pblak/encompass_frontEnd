<template>
    <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
        <div class="_flex _flex-wrap _gap-4">
            <v-text-field variant="solo"
                          v-model="name"   ></v-text-field>
        </div>
        <v-text-field variant="solo" density="comfortable"
                      v-model="roomForm.capacity" label="Capacity"
                      :rules="$rules('required|number' ,'Capacity')"></v-text-field>

        <v-textarea
            variant="solo" density="comfortable"
            v-model="roomForm.notes"
            label="note"
            counter
            :rules="$rules('max:300' ,'note')"
        ></v-textarea>
    </v-form>
</template>
<script lang="ts" setup>
import type {RoomType} from "@/stats/roomState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";


type PushDataType = (data: { validate: boolean, data: RoomType }) => void;
const props = defineProps<{
    eventForValidate: string,
    roomSelected: RoomType,
    pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const name = ref(props.roomSelected.name);
const roomForm = props.roomSelected

const ElForm = ref<any>(null);
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    if(!valid) return;
    roomForm.name = name.value;
    props.pushData({
        validate: valid,
        data: {
            ...roomForm
        }
    });
};
onMounted(() => {
    on(() => {
        validateForm();
    });
})
</script>
