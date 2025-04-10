<template>
  <v-app v-if="dataLoaded">
    <v-navigation-drawer app disable-route-watcher
                         v-model="drawer"
                         color="grey-lighten-3"
                         v-if="userLogin">
      <v-list color="blue">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar color="primary" size="40">

              <v-img v-if="userLogin.infos.avatar"
                     alt="John" :src="APP_URL+userLogin.infos.avatar"></v-img>
              <span v-else>
                            {{ userLogin.name.slice(0, 2).toUpperCase() }}
                          </span>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ userLogin.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
                            <span>
                                 {{ userLogin.email }}
                            </span>
            <span class="_text-gray-500">
                                {{ userLogin.accountType === "web" ? "Admin" : userLogin.accountType }}
                            </span>

          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider class="border-opacity-100 _border-gray-400"></v-divider>

      <v-treeview :items="dashboardChildren"
                  class="!_p-0"
                  collapse-icon=""
                  density="comfortable"
                  expand-icon=""
      >

        <template v-slot:prepend="{ item }">
          <router-link
              v-if="item.meta && item.meta.icon"
              :to="item.path" class="_ml-[-1rem] _pr-5 _pl-5">
            <v-icon>{{ item.meta.icon }}</v-icon>
          </router-link>
        </template>
        <template v-slot:title="{ item }">
          <router-link :to="item.path"
                       class="_block _mr-[-1rem] _capitalize">
            {{ item.meta && item.meta.__name }}
          </router-link>
        </template>
      </v-treeview>
      <template v-slot:append></template>
    </v-navigation-drawer>

    <v-app-bar color="grey-lighten-3" elevation="0">
      <v-app-bar-nav-icon v-if="!drawer" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn density="comfortable" flat :icon="true" v-bind="props">
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
    </v-app-bar>

    <v-main class="_flex _flex-col">
      <div class="_p-4 _flex _flex-col _flex-1">
        <router-view name="dashboard"></router-view>
      </div>
    </v-main>
  </v-app>
  <v-sheet v-else class="!_flex  _justify-center _items-center _h-screen">
    <v-card variant="flat">
      <v-card-text>
        <v-progress-circular :model-value="loadingProgress" :size="120" :width="10" color="teal">
          <template v-slot:default>
            {{ loadingProgress === 100 ? 'Ready ️‍🔥' : 'Loading...' }}
          </template>
        </v-progress-circular>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script lang="ts" setup>
import {loginState} from '@/stats/loginState';
import {onMounted, type Ref, ref, type UnwrapRef, watch} from 'vue';
import {type RouteRecordRaw, useRouter} from 'vue-router';
import {canGoTo} from "@/stats/Utils";

import {exeGlobalGetInstruments, onSucGlobalGetInstruments} from "@/api/useInstrument";
import {exeGlobalGetParents, onSucGlobalGetParents} from "@/api/useParent";
import {exeGlobalGetTeachers, onSucGlobalGetTeachers} from "@/api/useTeacher";
import {exeGlobalGetLessons, onSucGlobalGetLessons} from "@/api/useLesson";
import {exeGlobalGetStudents, onSucGlobalGetStudents} from "@/api/useStudent";
import {exeGlobalGetRooms, onSucGlobalGetRooms} from "@/api/useRoom";
import {exeGlobalGetTransactions, onSucGlobalGetTransactions} from "@/api/useTransaction";
import {exeGlobalGetPackages, onSucGlobalGetPackages} from "@/api/usePackage";

import {packageState} from "@/stats/packageState";
import {instrumentState} from "@/stats/instrumentState";
import {teacherState} from "@/stats/teacherState";
import {parentState} from "@/stats/parentState";
import {studentState} from "@/stats/studentState";
import {lessonState} from "@/stats/lessonState";
import {roomState} from "@/stats/roomState";
import {transactionState} from "@/stats/transactionState";


const {InstrumentList} = instrumentState();
const {PackageList} = packageState();
const {TeacherList} = teacherState();
const {ParentList, withTrashParent} = parentState();
const {StudentList, withTrashStudent} = studentState();
const {LessonList, withTrashLesson} = lessonState();
const {RoomList} = roomState();
const {TransactionList} = transactionState();

const {userLogin, isLogin, logout} = loginState();
const router = useRouter();
const dashboardRoute: RouteRecordRaw =
    router.options.routes.find(route => route.name === 'dashboard') as RouteRecordRaw;
const dashboardChildren: Ref<UnwrapRef<RouteRecordRaw>[]> = ref(dashboardRoute?.children || []);
const dataLoaded = ref(false);
const loadingProgress = ref(0);
const rail = ref(false);
const APP_URL = import.meta.env.VITE_APP_URL;
const drawer = ref(true);
if (!isLogin.value) {
  window.location.href = '/login';
}

// const logout = () => {
//   localStorage.removeItem('token');
//   isLogin.value = false;
//   window.location.href = '/login';
// }

const loadData = async () => {
  const registeredTasks = [
    exeGlobalGetInstruments,
    exeGlobalGetParents,
    exeGlobalGetTeachers,
    exeGlobalGetLessons,
    exeGlobalGetStudents,
    exeGlobalGetRooms,
    exeGlobalGetTransactions,
    exeGlobalGetPackages,
  ];
  let completed = 0;

  const updateProgress = () => {
    completed++;
    loadingProgress.value = ((completed / registeredTasks.length) * 100);
    // console.log(`Progress: ${((completed / registeredTasks.length) * 100).toFixed(2)}%`);
  };

  const taskPromises = registeredTasks.map(task => {
    return task().then(result => {
      updateProgress();
      return result;
    }).catch(() => {
      updateProgress();
    });
  });

  await Promise.all(taskPromises).then(() => {
    setTimeout(() => {
      dataLoaded.value = true;
    }, 500);
  })
}

const filterRoutesRecursively = async (routes: any[]): Promise<any[]> => {
  const filtered = await Promise.all(
      routes.map(async (route) => {
        const canAccess = await canGoTo({name: route.name})
            .then((res) => res)
            .catch(() => false);

        if (!canAccess) return null;

        if (route.children && route.children.length) {
          route.children = await filterRoutesRecursively(route.children);
        }

        return route;
      })
  );

  return filtered.filter((route) => route !== null);
}

onMounted(async () => {
  await loadData()
  try {
    dashboardChildren.value = await filterRoutesRecursively(dashboardChildren.value);
    console.log('dashboardChildren', dashboardChildren.value);
  } catch (error) {
    // throw new Error(error);
  }
});

dashboardChildren.value = dashboardRoute?.children!.filter((i: RouteRecordRaw) => {
  if (i.meta) {
    return i.meta["sidebar"] !== false
  } else {
    return false
  }
}) || [];
onSucGlobalGetPackages((res: any) => {
  PackageList.value = res.data
})
onSucGlobalGetInstruments((res: any) => {
  InstrumentList.value = res.data
})
onSucGlobalGetStudents((res: any) => {
  StudentList.value = res.data
  // console.log('StudentList', res.data)
})
onSucGlobalGetTeachers((res: any) => {
  TeacherList.value = res.data
})
onSucGlobalGetParents((res: any) => {
  ParentList.value = res.data
})
onSucGlobalGetRooms((res: any) => {
  RoomList.value = res.data
  // console.log('RoomList', RoomList.value)
})
onSucGlobalGetTransactions((res: any) => {
  TransactionList.value = res.data
  // console.log('TransactionList', TransactionList.value)
})
onSucGlobalGetLessons((res: any) => {
  LessonList.value = res.data
  // .map((lesson: any) => {
  //     if (!lesson.instrument_plan) return 0;
  //     let total = Object.values(lesson.planning).reduce((acc, val) => {
  //         return acc + val.length
  //     }, 0)
  //     lesson.price = total * parseInt(lesson.instrument_plan?.price) * lesson.frequency
  //     return lesson
  // })
  console.log('LessonList', LessonList.value)
})

watch(withTrashLesson, () => {
  exeGlobalGetLessons({
    withTrashed: withTrashLesson.value
  })
})
watch(withTrashStudent, () => {
  exeGlobalGetStudents({
    data: {
      withTrashed: withTrashStudent.value
    }
  })
})
watch(withTrashParent, () => {
  exeGlobalGetParents({
    params: {
      withTrashed: withTrashParent.value
    }
  })
})
</script>
