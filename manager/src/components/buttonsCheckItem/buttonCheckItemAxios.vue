<template>
    <div class="check_icon no_highlights">
        <button class="btn-circler" style="box-shadow: none" @click="openPopup" :style="state.isChecked === false && 'transform: rotate(180deg)'">
            <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg">
                <g stroke="null">
                    <path :fill="state.isChecked !== null ? style : 'none' " d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                    <path :fill="style" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                    <path fill="none" d="M8.679 8.929h.103"/>
                </g>
            </svg>
        </button>

        <transition name="fade">
            <div class="background" v-show="showPopup" @click="closePopup"></div>
        </transition>
        <transition name="fade">
            <div class="popup" v-show="showPopup">
                <button class="btn-circler" @click="handleCheckOrUncheck(true)" :disabled="state.acline" style="margin-right: 16px">
                    <span class="spinner-loading" style="width:24px; height:24px" v-if="state.acline"></span>

                    <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg" v-else>
                        <g stroke="null">
                            <path :fill="state.isChecked === true ? '#287928' : 'none' " d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                            <path fill="#287928" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                            <path fill="none" d="M8.679 8.929h.103"/>
                        </g>
                    </svg>
                </button>

                <button class="btn-circler" style="transform: rotate(180deg)" @click="handleCheckOrUncheck(false)" :disabled="state.decline">
                    <span class="spinner-loading" style="width:24px; height:24px" v-if="state.decline"></span>

                    <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg" v-else>
                        <g stroke="null">
                            <path :fill="state.isChecked === false ? '#F51720' : 'none' " d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                            <path fill="#F51720" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                            <path fill="none" d="M8.679 8.929h.103"/>
                        </g>
                    </svg>
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore as useStoreHistory } from '@/store/history'

import axios from "@/services/api"
import { notify } from "@kyvg/vue3-notification"

export default {
    emits: ["edit-item"],
    props: {
        item: Object
    },
    setup(props, { emit }){
        const history = useStoreHistory();
        const showPopup = ref(false)
        const state = reactive({ isChecked: undefined, acline: false, decline: false })

        const style = computed(() => {
            if(state.isChecked === false)
                return '#F51720'

            if(state.isChecked === true && !props.item.reinspected_at)
                return '#287928'

            if(state.isChecked === true && props.item.reinspected_at)
                return "#FFA500"

            return 'gray'
        })

        onMounted(() => {
            state.isChecked = props.item.checked
        })


        function openPopup(){
            history.push({ name: "popup_check_item", fn: closePopup })
            showPopup.value = true
        }
        function closePopup(){
            history.remove("popup_check_item")
            showPopup.value = false
        }

        async function handleCheckOrUncheck(checkOrUncheck){
            if(checkOrUncheck)
                state.acline = true
            else
                state.decline = true

            try {
                const alterations = { id: props.item.id, checked: props.item.checked === checkOrUncheck ? null : checkOrUncheck }
                await axios.put("/services/check-items", alterations)
                notify({
                    title: "Editado com sucesso!",
                    type: "success",
                    duration: 5000
                })
                emit("edit-item", alterations)
                closePopup();
                state.isChecked = checkOrUncheck;
            } catch (error) {
                console.error(error);
                notify({
                    title: "Erro ao editar!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.acline = false
                state.decline = false
            }
        }
      
        return {
            style,
            showPopup,
            state,
            openPopup,
            closePopup,
            handleCheckOrUncheck
        }
    }
}
</script>

<style lang="less" scoped>
    .background{
        background-color: rgba(0, 0, 0, .4);   
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        cursor: default;

        z-index: 1;

    }
    .popup{
        position: absolute;
        right: 0;
        top: -6px;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        z-index: 2;

    }
    .btn-circler{
        width: 46px;
        height: 46px;
        border-radius: 50%;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, .4);
        // padding: 12px;
        background-color: #fff;
        border: none;
        cursor: pointer;
        position: relative;
      
        &:hover{
            background-color: rgb(230, 230, 230);
        }

        &:active{
            transform: scale(.95);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 140ms;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

     .spinner-loading {
        border: solid 4px transparent;
        border-bottom: solid 4px #FF7900;
        border-radius: 50%;
        // position: absolute;
        top: calc(50% - 13px);
        left: calc(50% - 13px);
        position: absolute;
        transform: rotate(0deg);
        animation: animation-reload 1250ms infinite;
        display: block;
    }

    @keyframes animation-reload {
        to {
            transform: rotate(0deg);
        }
        from {
            transform: rotate(1080deg);
        }
    }
</style>