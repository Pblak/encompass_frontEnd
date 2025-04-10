<template>
  <div class="_flex _justify-center _items-center _h-screen">
    <musicPatternImage/>
    <v-card class="_w-96" :loading="registerLoading" color="grey-lighten-4">
      <v-card-title class="_text-center">Register</v-card-title>
      <v-card-text>
        <div class="_flex justify-center _w-full">
          <v-chip-group v-model="accountType" selected-class="text-green">
            <v-chip label value="parents">Parent</v-chip>
            <v-chip label value="teachers">Teacher</v-chip>
          </v-chip-group>
        </div>

        <div class="_py-2">
          <v-alert v-if="registerError" type="error" variant="tonal" density="comfortable">
            {{ registerError }}
          </v-alert>
        </div>


        <div v-if="accountType">
          <v-text-field
              label="Email"
              v-model="email"
              density="comfortable"
              variant="solo"
          ></v-text-field>
          <v-text-field
              label="First Name"
              v-model="firstName"
              density="comfortable"
              variant="solo"
          ></v-text-field>
          <v-text-field
              label="Last Name"
              v-model="lastName"
              density="comfortable"
              variant="solo"
          ></v-text-field>
          <v-text-field
              v-if="accountType === 'students'"
              label="Username"
              v-model="username"
              density="comfortable"
              variant="solo"
          ></v-text-field>
          <v-text-field
              label="Password"
              v-model="password"
              type="password"
              density="comfortable"
              variant="solo"
          ></v-text-field>
          <v-text-field
              label="Confirm Password"
              v-model="confirmPassword"
              type="password"
              density="comfortable"
              variant="solo"
          ></v-text-field>
        </div>

        <div>
          <p>
            if you have an account, please
            <router-link :to="{ name: 'login' }" class="_text-blue-500">
              login
            </router-link>
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="plain"
               :to="{name: 'home'}" prepend-icon="fa fa-thin fa-home"
        >Home
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="tonal" @click="attemptRegister">Register</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {loginState} from "@/stats/loginState.js";
import MusicPatternImage from "@/components/common/musicPatternImage.vue"; // You may need to create this

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const accountType = ref('');
const registerLoading = ref(false);

const {register, registerError} = loginState();

const attemptRegister = async () => {
  registerLoading.value = true;

  await register({
    email: email.value,
    username: username.value,
    first_name: firstName.value,
    last_name: lastName.value,
    password: password.value,
    confirmPassword: password.value,
    accountType: accountType.value
  }).catch((e) => {
    registerLoading.value = false;
    console.log('register error', e);
  });
};

watch(() => registerError, (newVal) => {
  // optional reactive handling
});
</script>
