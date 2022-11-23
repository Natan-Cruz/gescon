export default [
    {
        path: "login/identifier",
        name: "auth/login/identifier",
        component:  () => import ( /* webpackChunkName: "user-auth" */ "@/views/userAuth/login/identifier.vue"),
        meta: {
            titlePage: "Gescon - Fazer login",
            titleView: "Fazer login",
            transition: 'slide-left-auth'
        }
    },
    {
        path: "login/challenge",
        name: "auth/login/challenge",
        component:  () => import ( /* webpackChunkName: "user-auth" */ "@/views/userAuth/login/challenge.vue"),
        meta: {
            titlePage: "Gescon - Fazer login",
            titleView: "Fazer login",
            transition: 'slide-right-auth',
        }
    },
    {
        path: "reset-password/method",
        name: "auth/reset-password",
        component:  () => import ( /* webpackChunkName: "user-auth" */ "@/views/userAuth/reset-password/method"),
        meta: {
            titlePage: "Gescon - Recuperar senha",
            titleView: "Recuperar conta"
        }
    },
    {
        path: "reset-password/change/:token",
        name: "auth/reset-password/change",
        component:  () => import ( /* webpackChunkName: "user-auth" */ "@/views/userAuth/reset-password/change"),
        meta: {
            titlePage: "Gescon - Recuperar senha",
            titleView: "Recuperar conta",
        }
    },
    { path: "", redirect: "/auth/login/identifier"}
]