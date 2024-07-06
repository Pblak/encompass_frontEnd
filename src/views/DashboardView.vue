<template>
   <v-app>
      <v-navigation-drawer v-model="drawer" class="pt-4" color="grey-lighten-3" update:rail="()=>drawer">
         <v-list>
            <v-list-item :title="userLogin.name"
                         prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="sandra_a88@gmailcom"></v-list-item>
         </v-list>
         <v-divider class="border-opacity-100 _border-gray-400"></v-divider>
         <v-list>
            <template v-for="item in dashboardChildren" :key="item.name">
               <v-list-item v-if="item.meta && item.meta?.sidebar !== false"
                            :prepend-icon="item.meta.icon as string" :title="item.meta?.title as string"
                            :to="{ name: item.name}" class="_text-sm _font-bold _capitalize" link>
                  {{ item.meta?.__name }}
               </v-list-item>
            </template>
         </v-list>
         <template v-slot:append>
            <v-list-item class="!_py-4">
               <template v-slot:prepend>
                  <v-menu open-on-hover >
                     <template v-slot:activator="{ props }">
                        <v-btn icon v-bind="props" flat density="comfortable">
                           <v-icon size="20">fa fa-cog</v-icon>
                        </v-btn>
                     </template>
                     
                     <v-list width="250">
                        <v-list-item  @click="logout" link density="compact">
                           <template v-slot:prepend>
                              <v-icon>fa fa-door-open</v-icon>
                           </template>
                           <v-list-item-title>
                              Logout
                           </v-list-item-title>
                        </v-list-item>
                     </v-list>
                  </v-menu>
               </template>
            </v-list-item>
         </template>
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
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {loginState} from '@/stats/loginState';
import {ref} from "vue";

const {userLogin, isLogin} = loginState();
const router = useRouter();
const dashboardRoute = router.options.routes.find(route => route.name === 'dashboard');
const dashboardChildren = dashboardRoute ? dashboardRoute.children : []
const drawer = ref(true);

if (!isLogin.value) {
   window.location.href = '/login';
}

const logout = () => {
   localStorage.removeItem('token');
   isLogin.value = false;
   window.location.href = '/login';
}
</script>
