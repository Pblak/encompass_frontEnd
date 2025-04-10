import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
    type RouteRecordRaw
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/LoginView.vue'
import middlewareRegistry from '../../src/router/middleware/core/middlewareRegistry'
import {middlewarePipeline, parseMiddleware} from '@/router/middleware/core/middlewarePipeline';
import {apiInstance} from "@/api/useApi";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        redirect: {name: 'landing'},
        children: [
            {
                path: '/',
                name: 'landing',
                meta: {
                    __name: 'landing',
                    __auth: false
                },
                component: () => import('@/views/LandingPage.vue'),
            },
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
        redirect: {name: 'monitor'},
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
                children: [
                    {
                        path: '/dashboard/monitor/lesson',
                        name: 'monitorLesson',
                        meta: {
                            __name: 'monitorLesson',
                            __auth: true,
                        },
                        component: () => import('@/views/dashboard/monitor/MonitorLesson.vue')
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
                redirect: {name: 'LessonsList'},
                children: [
                    {
                        path: '/dashboard/lesson/createLessons',
                        name: 'createLessons',
                        meta: {
                            __name: 'Create lesson',
                            __auth: true,
                            middleware: ['auth:users']
                        },
                        components: {
                            dashboard: () => import('../views/dashboard/lesson/createLessons.vue')
                        },
                    },
                    {
                        path: '/dashboard/lesson/LessonsList',
                        name: 'LessonsList',
                        meta: {
                            __name: 'Lessons List',
                            __auth: true,
                        },
                        components: {
                            dashboard: () => import('@/views/dashboard/LessonView.vue')
                        },
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
                    middleware: ['auth:users']
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
                    middleware: ['auth:users']
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
                    apiInstance.get(`/getTeacher/${teacher_id}`).then((response) => {
                        if (response.data.id === parseInt(teacher_id as string)) {
                            next()
                        } else {
                            next('/dashboard/teacher')
                        }
                    }).catch((error) => {
                        console.error('/dashboard/teacher', error)
                        next('/dashboard/teacher')
                    })
                }
            },
            {
                path: '/dashboard/student',
                name: 'student',
                meta: {
                    __name: 'student',
                    __auth: true,
                    icon: 'fa-thin fa-children',
                    middleware: ['auth:users|parents']
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
                    apiInstance.get(`/getStudent/${student_id}`).then((response) => {
                        if (response.data.id === parseInt(student_id as string)) {
                            next()
                        } else {
                            next('/dashboard/student')
                        }
                    }).catch((error) => {
                        console.error('/dashboard/student', error)
                        next('/dashboard/student')
                    })

                }
            },
            {
                path: '/dashboard/parent',
                name: 'parent',
                meta: {
                    __name: 'parent',
                    __auth: true,
                    icon: 'fa-thin fa-person-breastfeeding',
                    middleware: ['auth:users']
                },
                components: {
                    dashboard: () => import('@/views/dashboard/ParentView.vue')
                }
            },
            // ParentDetails
            {
                path: '/dashboard/parent/:parent_id',
                name: 'ParentDetails',
                meta: {
                    __name: 'parent',
                    __auth: true,
                    sidebar: false,
                    icon: 'fa-thin fa-children',
                },
                components: {
                    dashboard: () => import('@/views/dashboard/parent/ParentDetails.vue')
                },
                beforeEnter: (to
                    , from
                    , next) => {
                    const parent_id = to.params.parent_id
                    apiInstance.get(`/getParent/${parent_id}`).then((response) => {
                        if (response.data.id === parseInt(parent_id as string)) {
                            next()
                        } else {
                            next('/dashboard/parent')
                        }
                    }).catch((error) => {
                        console.error('/dashboard/parent', error)
                        next('/dashboard/parent')
                    })
                }
            },
            {
                path: '/dashboard/instrument',
                name: 'instrument',
                meta: {
                    __name: 'instrument & Package',
                    __auth: true,
                    icon: 'fa-thin fa-guitar',
                    middleware: ['auth:users']
                },
                children: [
                    {
                        path: '/dashboard/instrument',
                        name: 'instrumentList',
                        meta: {
                            __name: 'instrument',
                            __auth: true,
                            middleware: ['auth:users']
                        },
                        components: {
                            dashboard: () => import('../views/dashboard/InstrumentView.vue')
                        },
                    },
                    {
                        path: '/dashboard/package',
                        name: 'packageList',
                        meta: {
                            __name: 'Package',
                            __auth: true,
                            middleware: ['auth:users']
                        },
                        components: {
                            dashboard: () => import('../views/dashboard/PackageView.vue')
                        },
                    }
                ]
            },
            {
                path: '/dashboard/transaction',
                name: 'transaction',
                meta: {
                    __name: 'transaction',
                    __auth: true,
                    icon: 'fa-thin fa-money-bill-wave',
                    middleware: ['auth:users']
                },
                components: {
                    dashboard: () => import('@/views/dashboard/TransactionView.vue')
                }
            },
            {
                path: '/dashboard/event',
                name: 'event',
                meta: {
                    __name: 'event',
                    __auth: true,
                    icon: 'fa-thin fa-calendar',
                    sidebar: false
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
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    // If no middleware is specified, proceed to the route
    if (!to.meta.middleware) {
        return next();
    }

    // Parse and prepare middleware functions
    const middleware = (to.meta.middleware as string[]).map((middlewareWithParams) => {
        const {name, parsedParams} = parseMiddleware(middlewareWithParams);
        const middlewareFunction = middlewareRegistry[name];

        if (!middlewareFunction) {
            // Fallback middleware that simply calls `next`
            return (context: any) => context.next();
        }
        // Return middleware function wrapped with context
        return (context: any) => middlewareFunction({...context, params: parsedParams});
    });

    const context = {
        to,
        next: () => Promise.resolve(), // Ensure next is a Promise-returning function
        from,
        router
    };

    // Execute middleware pipeline
    return middlewarePipeline(context, middleware, 0)
        .then(() => next()) // Continue navigation if all middleware passed
        .catch(() => next(false)); // Abort navigation if any middleware fails
});
export default router
