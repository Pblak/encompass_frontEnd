import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {
                    // login route
                    path: '/login',
                    name: 'login',
                    meta: {
                        __name: 'login',
                        __auth: false
                    },
                    component: Login
                }
            ]
        },
        {
            // dashboard route
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
                    components: {
                        dashboard: () => import('@/views/dashboard/MonitorView.vue')
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
                    path: '/dashboard/parent',
                    name: 'parent',
                    meta: {
                        __name: 'parent',
                        __auth: true,
                        icon: 'fa-thin fa-adult',
                    },
                    components: {
                        dashboard: () => import('@/views/dashboard/ParentView.vue')
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
