<template>
   <v-app>
      <v-navigation-drawer :rail="rail" color="grey-lighten-3" expand-on-hover
                           permanent update:rail="()=>drawer" @click="rail = false">
         <v-list color="blue">
            <v-list-item :title="userLogin.name"
                         prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                         :subtitle="userLogin.accountType">
               <template v-slot:append>
                  <v-btn :icon="true" variant="text" @click.stop="rail = !rail">
                     <v-icon size="10">{{ rail ? 'fa fa-chevron-left' : 'fa fa-chevron-right' }}</v-icon>
                  </v-btn>
               </template>
            </v-list-item>
         </v-list>
     
         <v-divider class="border-opacity-100 _border-gray-400"></v-divider>
         <v-treeview :items="dashboardChildren"   class="!_p-0" collapse-icon=""
                     density="comfortable" expand-icon="">
            <template v-slot:prepend="{ item  }" class="!_p-0">
               
               <router-link
                 v-if="item.meta && item.meta.icon" :to="item.path" class="_ml-[-1rem] _pr-5 _pl-5">
                  <v-icon>{{ item.meta.icon }}</v-icon>
               </router-link>
            </template>
            <template v-slot:title="{ item }">
               <router-link :to="item.path" class="_block _mr-[-1rem] _capitalize">
                  {{ item.meta && item.meta.__name }}
               
               </router-link>
            </template>
         </v-treeview>
         <template v-slot:append>
            <v-list-item class="!_py-4 !px-2">
               <template v-slot:prepend>
                  <v-menu open-on-hover>
                     <template v-slot:activator="{ props }">
                        <v-btn density="comfortable" flat :icon="true"  v-bind="props">
                           <v-icon size="20">fa fa-cog</v-icon>
                        </v-btn>
                     </template>
                     <v-list width="250">
                        <v-list-item density="compact" link @click="logout">
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
         <div class="_p-4">
            <router-view name="dashboard"></router-view>
         </div>
      </v-main>
   </v-app>
</template>
<script lang="ts" setup>
import {loginState} from '@/stats/loginState';
import {onMounted, type Ref, ref, type UnwrapRef} from 'vue';
import {type RouteRecordRaw, useRouter} from 'vue-router';
import {canGoTo} from "@/stats/Utils";

const router = useRouter();
const {userLogin, isLogin} = loginState();
const dashboardRoute : RouteRecordRaw =
  router.options.routes.find(route => route.name === 'dashboard') as RouteRecordRaw;
const dashboardChildren : Ref<UnwrapRef<RouteRecordRaw>[]> = ref(dashboardRoute?.children || []);

dashboardChildren.value = dashboardRoute?.children?.filter((i: RouteRecordRaw) => {
   if(i.meta) {
      return i.meta.sidebar !== false
   }else{
      return false
   }
}) || [];


const rail = ref(false);
if (!isLogin.value) {
   window.location.href = '/login';
}

const logout = () => {
   localStorage.removeItem('token');
   isLogin.value = false;
   window.location.href = '/login';
}

// const updateActiveItems = (item: any) => {
//    console.log(item);
// }
onMounted(async () => {
   try {
      const filteredRoutes = await Promise.all(
        dashboardChildren.value.map(async (route: any) => {
           const canAccess = await canGoTo({ name: route.name })
             .then((res) => {
                return res;
             })
             .catch((error) => {
                return false;
             });
           return canAccess ? route : null;
        })
      );
      dashboardChildren.value = filteredRoutes.filter((route: any) => route !== null);
   } catch (error) {
   
   }
});
</script>
