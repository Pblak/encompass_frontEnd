<script lang="ts" setup>

import {onMounted, ref} from "vue";
import { type TeacherType} from "@/stats/teacherState";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: TeacherType }) => void;
const props = defineProps<{
  eventForValidate:string,
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);

const teacherForm = ref<TeacherType>({
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  parent_id: 0,
  infos: {
    phone1: "",
    address: {
      street: "",
      city: "",
      zip: "",
      state: "",
    },
    gender: "male",
  }
})

const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...teacherForm.value}
  });

};
onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
<template>

  <v-form  ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
    <div class="_flex _gap-2">
      <v-text-field v-model="teacherForm.first_name" :rules="$rules('required', 'First Name')"
                    label="First Name" outlined></v-text-field>
      <v-text-field v-model="teacherForm.last_name" :rules="$rules('required', 'Last Name')"
                    label="First Name" outlined></v-text-field>
    </div>
<!--    <v-text-field v-if="dialogEdit" :value="teacherForm.email" active disabled-->
<!--                  label="Email"></v-text-field>-->
    <v-text-field  v-model="teacherForm.email" :rules="$rules('required|email', 'Email')"
                  label="Email" outlined></v-text-field>
    <div class="_flex _gap-2">
      <v-text-field v-model="teacherForm.infos.phone1" :rules="$rules('required|phone', 'Phone')"
                    label="Phone 1" outlined></v-text-field>
      <v-text-field v-model="teacherForm.infos.phone2" :rules="$rules('phone', 'Phone')"
                    label="Phone 2" outlined></v-text-field>
    </div>
    <div class="_flex _gap-2">
      <v-text-field v-model="teacherForm.infos.address.street"
                    label="Street" outlined></v-text-field>
      <v-text-field v-model="teacherForm.infos.address.city"
                    label="City" outlined></v-text-field>
    </div>
    <div class="_flex _gap-2">
      <v-text-field v-model="teacherForm.infos.address.state"
                    label="State" outlined></v-text-field>
      <v-text-field v-model="teacherForm.infos.address.zip"
                    label="Zip" outlined></v-text-field>
    </div>
  </v-form>

</template>
