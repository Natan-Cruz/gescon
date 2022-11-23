<template>
    <div class="tree-table">

        <ul class="content-tree-table">
            <item-table 
                v-for="(permission, i) in Whitelist" :key="i" 
                :data="permission"
                :disabled="disabled"
                @select-item="handleSelectItem" 
                @deselect-item="deselectItem"/>
        </ul>
        <div class="detail-gradient"></div>
    </div>
</template>

<script>
import itemTable from "./itemTable.vue"

import whitelist from "./whitelist.js"
import { computed } from 'vue'

export default {
    components: { itemTable },
    props:{
        permissions: {
            type: Array,
            required: true,
            default: () => []
        },
        disabled: Boolean
    },
    setup(props, { emit }){

        const mPermissions = computed({
            get: () => props.permissions,
            set: permissions => emit("update:permissions", permissions)
        })

        // permissionString = key:value
        // permissionString = edit:clients
        function handleSelectItem(permissionString){
            if(!permissionString) return;

            permissionString.forEach( permission => {
                const has = mPermissions.value.findIndex( perm => perm === permission ) > -1 
                if(!has) mPermissions.value.push(permission)
            })
        }
        function deselectItem(permissionString){
            if(!permissionString) return;

            mPermissions.value = mPermissions.value.filter( formPermission => {
                return permissionString.findIndex( perm => perm === formPermission ) === -1 
            })
        }

        const Whitelist = computed(() => {
            // name, feature, items
            const permissions = props.permissions;
            return whitelist.map( permission => {
                const items = permission.items.map( item => {
                    
                    if(typeof item === "object"){
                        return {
                            ...item,
                            actions: getActions(permissions, item)
                        }
                    }
                    else return item
                })

                return {
                    ...permission,
                    actions: getActions(permissions, permission),
                    items
                }
            })
        })
      

        function getActions(formPermissions, whitelistPermission){
            return formPermissions.filter( formPermission => {
                const [, feature ] = formPermission.split(":")
                return whitelistPermission.feature === feature
            }).map( perm => {
                const [ action, ] = perm.split(":")
                return action
            })
        }

        return {
            Whitelist,
            // methods
            handleSelectItem,
            deselectItem
        }
    }
}
</script>

<style lang="less" scoped>
    .tree-table{
        width: min-content;
        max-width: 100%;
        overflow-x: auto;
        padding-bottom: 6px;
        border-top: solid 1px #e0e4e9;

    }
    .content-tree-table{
        position: relative;
    }
    .detail-gradient{
        display: none;
        z-index: 2;
        width: 8px;

        position: absolute;
        right: 0;
        top: 0;

        pointer-events: none;
        height: 100%;
        background: linear-gradient(-90deg,rgba(171,181,186,.3),transparent);
    }

    @media screen and (max-width: 1097px){
        // .detail-gradient{
        //     display: block;
        // }
    }
</style>

<style lang="less" scoped>
    // scroll bar em geral
    ::-webkit-scrollbar {
        height: 8px;
    }

    // fundo da scroll bar
    ::-webkit-scrollbar-track {
        background: rgb(235, 235, 235);
        border-radius: 10px;
    }

    // botao da scroll bar
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius:10px;
    }

    // O resto das propriedades disabilita por segunraça
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-track-piece,
    ::-webkit-resizer {
        display: none;
    }
</style>
<style lang="less" scoped>
    .title{
        font-size:2em;
        margin-bottom: 20px;
        color: rgb(70, 70, 70);
    }
</style>