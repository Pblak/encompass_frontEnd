<template>

        <div class="_flex _justify-center _items-center _h-screen">
            <v-card class="_w-96" :loading="loginLoading">
                <v-card-title class="_text-center">Login</v-card-title>
                <v-card-text>
                    <div class="_flex justify-center _w-full">
                        <v-chip-group class="" v-model="accountType" selected-class="text-green">
                            <v-chip label value="student">Student</v-chip>
                            <v-chip label value="parent">Parent</v-chip>
                            <v-chip label value="teacher">Teacher</v-chip>
                        </v-chip-group>
                    </div>
                    <div class="_py-2">
                        <v-alert v-if="loginError" type="error" variant="tonal"
                                 density="comfortable">{{ loginError }}</v-alert>
                    </div>

                    <v-text-field v-if="accountType==='student'" label="Username" v-model="username"
                                  density="comfortable" variant="solo"></v-text-field>

                    <v-text-field v-else label="Email" v-model="email"
                                  density="comfortable" variant="solo"></v-text-field>


                    <v-text-field label="Password" v-model="password" type="password"
                                  density="comfortable" variant="solo"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" variant="tonal"
                           @click="attemptLogin">Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

</template>
<script setup lang="ts">
import {loginState} from "@/stats/loginState.js";
import {ref, watch} from "vue";

const email = ref('');
const username = ref('');
const password = ref('');
const accountType = ref('');
const loginLoading = ref(false);
const {login, loginError} = loginState();

const attemptLogin = async () => {
    loginLoading.value = true;

    await login({
        email: email.value,
        username: username.value,
        password: password.value,
        accountType: accountType.value
    }).catch((e) => {
        loginLoading.value = false;
        console.log('error', e)
    })

}

watch(() => loginError, (newVal) => {


})


</script>
