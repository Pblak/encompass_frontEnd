import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import {teacherState} from "@/stats/teacherState";
import {studentState} from "@/stats/studentState";

const {StudentList} = studentState()
const {TeacherList} = teacherState()
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {
                    path: '/login',
                    name: 'login',
                    meta: {
                        __name: 'login',
                        __auth: false
                    },
                    component: Login
                },
                {
                    path: '/register',
                    name: 'register',
                    meta: {
                        __name: 'register',
                        __auth: false
                    },
                    component: () => import('@/views/RegisterView.vue')
                }
            ]
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: {
                __name: 'dashboard',
                __auth: true
            },
            component: () => import('@/views/DashboardView.vue'),
            children: [
                {
                    path: '/dashboard/monitor',
                    name: 'monitor',
                    meta: {
                        __name: 'monitor',
                        __auth: true,
                        icon: 'fa-thin fa-monitor-waveform',
                    },
                    redirect: {name: 'monitorLesson'},
                    components: {
                        dashboard: () => import('@/views/dashboard/MonitorView.vue')
                    },
                    children:[
                        {
                            path:'/dashboard/monitor/lesson',
                            name:'monitorLesson',
                            meta:{
                                __name:'monitorLesson',
                                __auth:true,
                            },
                            component:()=>import('@/views/dashboard/monitor/MonitorLesson.vue')
                        }
                    ]
                },
                {
                    path: '/dashboard/lesson',
                    name: 'lesson',
                    meta: {
                        __name: 'Lesson',
                        __auth: true,
                        icon: 'fa-thin fa-book-open',
                    },
                    redirect: {name: 'createLessons'},
                    components: {
                        dashboard: () => import('@/views/dashboard/LessonView.vue')
                    },
                    children: [
                        {
                            path: '/dashboard/lesson/createLessons',
                            name: 'createLessons',
                            meta: {
                                __name: 'Create lesson',
                                __auth: true,
                            },
                            component:  ()=>import('../views/dashboard/lesson/createLessons.vue')
                        }
                    ]
                },
                {
                     // room
                    path: '/dashboard/room',
                    name: 'room',
                    meta: {
                        __name: 'room',
                        __auth: true,
                        icon: 'fa-thin fa-door-open',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/RoomView.vue')
                    }
                },
                {
                    path: '/dashboard/teacher',
                    name: 'teacher',
                    meta: {
                        __name: 'teacher',
                        __auth: true,
                        icon: 'fa-thin fa-chalkboard-user',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/TeacherView.vue')
                    },
                },
                {
                    path: '/dashboard/teacher/:teacher_id',
                    name: 'TeacherDetails',
                    meta: {
                        __name: 'teacher',
                        __auth: true,
                        sidebar: false,
                        icon: 'fa-thin fa-chalkboard-user',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/teacher/TeacherDetails.vue')
                    },
                    beforeEnter: (to, from, next) => {
                        const teacher_id = to.params.teacher_id
                        if (TeacherList.value.length === 0) {
                            next('/dashboard/teacher')
                        } else {
                            console.log("teacher")
                            const teacher = TeacherList.value.find((teacher: any) => teacher.id === parseInt(teacher_id as string))
                            console.log("teacher", teacher)
                            if (teacher === undefined) {
                                next('/dashboard/teacher')
                            } else {
                                next()
                            }
                        }

                    }
                },
                {
                    path: '/dashboard/student',
                    name: 'student',
                    meta: {
                        __name: 'student',
                        __auth: true,
                        icon: 'fa-thin fa-children',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/StudentView.vue')
                    }
                },
                {
                    path: '/dashboard/student/:student_id',
                    name: 'StudentDetails',
                    meta: {
                        __name: 'student',
                        __auth: true,
                        sidebar: false,
                        icon: 'fa-thin fa-children',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/student/StudentDetails.vue')
                    },
                    beforeEnter: (to, from, next) => {
                        const student_id = to.params.student_id
                        if (StudentList.value.length === 0) {
                            next('/dashboard/student')
                        } else {
                            const student = StudentList.value.find((student: any) => student.id === parseInt(student_id as string))
                            if (student === undefined) {
                                next('/dashboard/student')
                            } else {
                                next()
                            }
                        }

                    }
                },
                {
                    path: '/dashboard/parent',
                    name: 'parent',
                    meta: {
                        __name: 'parent',
                        __auth: true,
                        icon: 'fa-thin fa-person-breastfeeding',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/ParentView.vue')
                    }
                },

                {
                    path: '/dashboard/instrument',
                    name: 'instrument',
                    meta: {
                        __name: 'instrument',
                        __auth: true,
                        icon: 'fa-thin fa-guitar',
                    },
                    components: {
                        dashboard: () => import('../views/dashboard/InstrumentView.vue')
                    }
                },
                {
                    path: '/dashboard/event',
                    name: 'event',
                    meta: {
                        __name: 'event',
                        __auth: true,
                        icon: 'fa-thin fa-calendar',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/EventView.vue')
                    }
                },
                {
                    path: '/dashboard/message',
                    name: 'message',
                    meta: {
                        __name: 'message',
                        __auth: true,
                        icon: 'fa-brands fa-facebook-messenger',

                    },
                    components: {
                        dashboard: () => import('../views/dashboard/MessageView.vue')
                    }
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
    ]
})

export default router
