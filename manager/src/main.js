import { createApp, nextTick } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import * as Session from './auth/Session'
import setupInterceptors from './services/setupInterceptors'
import Notifications from '@kyvg/vue3-notification'
import Maska from "maska"
import Pushy from 'pushy-sdk-web';

// components
import formLoadingOrError from './globalComponents/formLoadingOrError.vue';
import loadingOrError from './globalComponents/loadingOrError.vue';
import Modal from './globalComponents/Modal.vue';
import wrapperInput from "./globalComponents/wrapperInput.vue"
import textareaAutosize from "./globalComponents/textareaAutosize.vue"
import spinnerLoading from './globalComponents/SpinnerLoadingComponent.vue';
import checkboxComponent from './globalComponents/checkboxComponent.vue';
// import accessControl from "./directives/accessControl"
// stores
import { createPinia } from 'pinia';
// import { storeReset } from './components/formPage/reset-store'
import { useStore as useStoreHistory } from "./store/history"
import { useStore as useStoreUser } from "./store/user"
import { useStore as useStoreAccessControl } from "./store/accessControl"

Pushy.setNotificationListener(function (data) {
    console.log(data)
    // new Notification(data.title, { })
});

function verifyPermissions(rootPermissions, userPermissions, splited = false){
    if(!rootPermissions || !userPermissions) return true;
    let havePermission = false
    if(Array.isArray(userPermissions)){
        userPermissions.forEach( mName => {
            if(havePermission) return;
            mName = splited ? mName.split(":")[1] : mName
            havePermission = rootPermissions.includes(mName)
        })
    }else{
        userPermissions = splited ? userPermissions.split(":")[1] : userPermissions
        havePermission = rootPermissions.includes(userPermissions)
    }
    return havePermission
} 

const app = createApp(App)
    .use(createPinia())
    .use(Notifications)
    .use(Maska);

const storeUser = useStoreUser()
const storeAccessControl = useStoreAccessControl()

app.directive("can",  (el, binding, vnode) => {
        const value = binding.arg || binding.value;

        let show = verifyPermissions(storeAccessControl.data.contracted_modules, value, true)

        // modulo nao contratado
        if(!show) return vnode.el.hidden = true;

        // admin
        if(storeAccessControl.data.is_admin) return vnode.el.hidden = false;

        show = verifyPermissions(storeAccessControl.data.manager, value)
      
        return vnode.el.hidden = !show;
    })
    .directive("can-group",  (el, binding, vnode) => {
        const value = binding.arg || binding.value;

        if(!value || !storeAccessControl.data.manager) return

        let show = false

        show = value.findIndex(({ module_name }) => {
            if(module_name)
                return storeAccessControl.data.contracted_modules.includes(module_name.split(":")[1])
            else 
                return true
        }) > -1

        // modulo nao contratado
        if(!show) return vnode.el.hidden = true;

        // admin
        if(storeAccessControl.data.is_admin) return vnode.el.hidden = false;
        
        show = value.findIndex(({ module_name }) => {
            if(module_name)
                return storeAccessControl.data.contracted_modules.includes(module_name)
            else
                return true
        }) > -1

        vnode.el.hidden = !show
    })
    .directive("can-construction",  (el, binding, vnode) => {
        const value = binding.arg || binding.value;

        // if(!value.module_name || !storeAccessControl.data.constructions) return
        let show = storeAccessControl.data.contracted_modules_construction.findIndex( ({ construction_id, module_name }) => {
            return value.construction_id === construction_id && value.module_name === module_name
        }) > -1

        show = value.default_module || show

        // modulo nao contratado
        if(!show) return vnode.el.hidden = true;

        // admin
        if(storeAccessControl.data.is_admin) return vnode.el.hidden = false;
          

        show = storeAccessControl.data.constructions.findIndex( ({ construction_id, module_name }) => {
            return value.construction_id === construction_id && value.module_name === module_name
        }) > -1

        return vnode.el.hidden = !show;
    })


;(function() {
    // Verifica se a versão da sessão gravado do client
    // é a mais atual, caso não for limpa e retorna a pagina de login
    // este processo possibilita alterar em produção a estrutura de dados de uma sessão
    
    // if(!Session.checkSessionVersion())
    //     return Session.closeSession()
    
    const isChecked = Session.checkSession()
    if(!isChecked) 
        return storeUser.closeSession();
    
    // Obtem o usuario da memoria e armazena na vuex
    const user = Session.getSession()
    if(user)
        storeUser.startSession(user);
})();

let initialLoading = true;
router.beforeEach( async (to, from, next) => {
    const history = useStoreHistory();

    if(history.queue.length){
        history.queue[history.queue.length - 1].fn();
        history.queue.splice(history.queue.length - 1, 1);
        return next(false)
    }

    const { requiresAuth, requiresNotAuth, moduleName } = to.meta;
    const { loggedIn } = storeUser;

    if(!requiresAuth && !requiresNotAuth) 
        return next()

    if(requiresAuth){
        // Requer permissao e precisa estar logado
        if(loggedIn){
            
            if(initialLoading)
                await storeAccessControl.fetchInitial();
                
            initialLoading = false
            
            if(storeAccessControl.viewer(moduleName))
                return next()
            else
                return next({ path: "/main/constructions/active" })
        }else 
            return next({ path: '/auth/login/identifier', query: { redirec: to.fullPath } });   
    }else
    if(requiresNotAuth){
        if(!loggedIn) 
            return next()
        else 
            return next({ path: "/main/constructions/active" });
    }
});


router.onError((error, to ) => {
    if (/Loading chunk./ig.test(error.message)) {
        router.push({ name: "router_error", query: { fullPath: to.fullPath }})
    }
})

const DEFAULT_TITLE = 'Gescon';
router.afterEach((to) => {
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    nextTick(() => {
        document.title = to.meta.titlePage || DEFAULT_TITLE;
    });
});

setupInterceptors({})

app.use(router)
    .component("spinner-loading", spinnerLoading)
    .component("wrapper-input", wrapperInput)
    .component("textarea-autosize", textareaAutosize)
    .component("loading-or-error", loadingOrError)
    .component("form-loading-or-error", formLoadingOrError)
    .component("Modal", Modal)
    .component("checkbox", checkboxComponent)
    .mount('#app')
