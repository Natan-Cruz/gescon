export default [
    {
        path: "users",
        alias: "",
        name: "sub_accounts/users",
        component: () => import ( /* webpackChunkName: "construction" */ "@/views/subAccounts/subpages/users/users.vue"),
        meta: { index: 1 }
    },
    {
        path: "roles",
        name: "sub_accounts/roles",
        component: () => import ( /* webpackChunkName: "construction" */ "@/views/subAccounts/subpages/roles/roles.vue"),
        meta: { index: 2 }
    },
]