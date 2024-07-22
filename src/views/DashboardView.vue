<template>
   <v-app>
      <v-navigation-drawer :rail="rail" permanent @click="rail = false" expand-on-hover
                           class="pt-4" color="grey-lighten-3" update:rail="()=>drawer">
         <v-list>
            <v-list-item :title="userLogin.name"
                         prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                         subtitle="sandra_a88@gmailcom">
               <template v-slot:append>
                  <v-btn @click.stop="rail = !rail" icon variant="text">
                        <v-icon size="10">{{ rail ? 'fa fa-chevron-left' : 'fa fa-chevron-right' }}</v-icon>
                  </v-btn>
               </template>
            </v-list-item>
         </v-list>
         <v-divider class="border-opacity-100 _border-gray-400"></v-divider>
         <!--         <v-list>-->
         <!--            <template v-for="item in dashboardChildren" :key="item.name">-->
         <!--               <v-list-item v-if="item.meta && item.meta?.sidebar !== false"-->
         <!--                            :prepend-icon="item.meta.icon as string" :title="item.meta?.title as string"-->
         <!--                            :to="{ name: item.name}" class="_text-sm _font-bold _capitalize" link>-->
         <!--                  {{ item.meta?.__name }}-->
         <!--                  <div>-->
         <!--                     <v-icon>fa fa-chevron-right</v-icon>-->
         <!--                  </div>-->
         <!--               </v-list-item>-->
         <!--            </template>-->
         <!--         </v-list>-->
         
         <!--         <v-expansion-panels variant="accordion"   flat>-->
         <!--            <template v-for="item in dashboardChildren" :key="item.name">-->
         <!--               <v-expansion-panel-->
         <!--                 text="Lorem ipsum dolor sit amet, consectetur adipisis nisi ut aliquip ex ea commodo consequat."-->
         <!--                 title="Item"-->
         <!--               ></v-expansion-panel>-->
         <!--            </template>-->
         <!--         </v-expansion-panels>-->
         
         <v-treeview :items="dashboardChildren" class="!_p-0" collapse-icon="" density="comfortable"
                     expand-icon="" active-strategy="classic">
            <template v-slot:prepend="{ item ,open }" class="!_p-0">
               <router-link v-if="item.meta.icon" :to="item.path" class="_ml-[-1rem] _pr-5 _pl-5">
                  <v-icon>{{ item.meta.icon }}</v-icon>
               </router-link>
            </template>
            <template v-slot:title="{ item }">
               <router-link :to="item.path" class="_block _mr-[-1rem] _capitalize">
                  {{ item.meta.__name }}
               </router-link>
            </template>
         </v-treeview>
         
         
         <template v-slot:append>
            <v-list-item class="!_py-4">
               <template v-slot:prepend>
                  <v-menu open-on-hover>
                     <template v-slot:activator="{ props }">
                        <v-btn density="comfortable" flat icon v-bind="props">
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
<!--         <v-app-bar>
            <v-app-bar-nav-icon :icon="drawer ? 'fa-duotone fa-bars' : 'fa-duotone fa-right'"
                                @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{ router.currentRoute.name }}</v-toolbar-title>
         </v-app-bar>-->
         <div class="_p-4">
            <router-view name="dashboard"></router-view>
         </div>
      </v-main>
   </v-app>
</template>
<script lang="ts" setup>
import {loginState} from '@/stats/loginState';
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const open = ref([]);

const router = useRouter();
const route = useRoute();
const {userLogin, isLogin} = loginState();
const dashboardRoute = router.options.routes.find(route => route.name === 'dashboard');
const dashboardChildren = dashboardRoute ? dashboardRoute.children?.filter((i:any) => i.meta.sidebar !== false) : []

const drawer = ref(true);
const rail = ref(false);

if (!isLogin.value) {
   window.location.href = '/login';
}

const logout = () => {
   localStorage.removeItem('token');
   isLogin.value = false;
   window.location.href = '/login';
}
const updateActiveItems = (item: any) => {
   console.log(item);
}
</script>
