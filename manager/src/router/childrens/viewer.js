export default [
    {
        path: "viewer",
        alias: "",
        name: "viewer/viewer",
        component: () => import( /* webpackChunkName: "file-viewer" */ "@/views/fileViewer/fileViewer/index.vue" ),
        meta: { titlePage: "Gescon - Visualizar arquivo" }
    },
    {
        path: "details",
        name: "viewer/details",
        component: () => import( /* webpackChunkName: "file-viewer" */ "@/views/fileViewer/fileDetails/index.vue" ),
        meta: { titlePage: "Gescon - Visualizar arquivo - detalhes" }
    },
]