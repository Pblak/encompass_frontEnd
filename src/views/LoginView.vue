<template>
  <v-main>
    <div class="_flex _justify-center _items-center _h-screen">
      <v-card class="_w-96">
        <v-card-title class="_text-center">Login</v-card-title>

        <v-card-text>
          <v-chip-group class="_flex justify-center _w-full" v-model="accountType"
                        selected-class="text-green">
            <v-chip label value="students">Student</v-chip>
            <v-chip label value="web">User</v-chip>
          </v-chip-group>

          <v-text-field label="Email"  v-model="email" outlined></v-text-field>
          <v-text-field label="Password" v-model="password" type="password" outlined></v-text-field>
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
const accountType = 'students';
const {login} = loginState();

</script>
