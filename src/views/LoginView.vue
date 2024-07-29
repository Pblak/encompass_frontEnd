<template>
  <v-main>
    <div class="_flex _justify-center _items-center _h-screen">
      <v-card class="_w-96">
        <v-card-title class="_text-center">Login</v-card-title>
        <v-card-text>
          <div class="_flex justify-center _w-full">
             <v-chip-group class="" v-model="accountType" selected-class="text-green">
                <v-chip label value="student">Student</v-chip>
                <v-chip label value="parent">Parent</v-chip>
                <v-chip label value="teacher">Teacher</v-chip>
             </v-chip-group>
          </div>

          <v-text-field label="Email"  v-model="email"
                       density="comfortable" variant="solo" ></v-text-field>
          <v-text-field label="Password" v-model="password" type="password"
                       density="comfortable" variant="solo" ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary"
                 @click="login({
                    email: email,
                    password: password,
                    accountType: accountType
                 })">Login</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-main>
</template>
<script setup lang="ts">
import {loginState} from "@/stats/loginState.js";
import {type Ref, ref, type UnwrapRef} from "vue";
const email = ref('');
const password = ref('');
const accountType = ref('');
const {login} = loginState();

</script>