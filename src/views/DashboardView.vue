<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" update:rail="()=>drawer" class="pt-4" color="grey-lighten-3" >
      <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="sandra_a88@gmailcom" :title="userLogin.name" ></v-list-item>
      </v-list>
      <v-divider class="border-opacity-100 _border-gray-400" ></v-divider>
      <v-list>
        <template v-for="item in dashboardChildren" :key="item.name" >
          <v-list-item v-if="item.meta && item.meta?.sidebar !== false"
              :title="item.meta?.title as string" :prepend-icon="item.meta.icon as string"
              link :to="{ name: item.name}">
            {{item.meta?.__name}}
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-app-bar>
        <v-app-bar-nav-icon :icon="drawer ? 'fa-duotone fa-bars' : 'fa-duotone fa-right'"
                            @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ router.currentRoute.name }}</v-toolbar-title>
      </v-app-bar>
      <div class="_p-4">
        <router-view name="dashboard"></router-view>
      </div>
    </v-main>
  </v-app>
</template>
<script setup  lang="ts">
import {useRouter} from "vue-router";
import {loginState}  from '@/stats/loginState';
import {ref} from "vue";

const {userLogin , isLogin} = loginState();
const router = useRouter();
const dashboardRoute = router.options.routes.find(route => route.name === 'dashboard');
const dashboardChildren  = dashboardRoute ? dashboardRoute.children  :  []
const drawer = ref(true);

if (!isLogin.value) {
  window.location.href = '/login';
}
</script>
