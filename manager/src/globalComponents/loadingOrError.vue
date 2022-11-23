<template>
    <div class="container-loading" v-if="(isLoading || error)" :style=" position_relative && 'position: relative'">

        <!-- <div v-show="isLoading" class="container-login-or-error" :style=" position_relative && 'position: relative'">
            <span class="spinner-loading" :style="{ width: `${width}px`, height: `${width}px` }"></span>
        </div> -->
        <div v-show="isLoading" class="loader">
            <svg class="circular" :style="{ width: `${width}px`, height: `${width}px` }" viewBox="25 25 50 50">
                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/>
            </svg>
        </div>

        <div v-show="errorMsg" class="container-msg-error" :style=" position_relative && 'position: relative'">
            <div>
                <p class="text-error">{{ errorMsg }}</p>

                <div class="container-buttons">
                    <button v-if="showButtonBack" class="button button-tertiary text-medium" style="margin-right:24px" @click="$emit('event-back')">Voltar</button>
                    <button v-if="showButtonRetry" class="button button-second text-medium " @click="$emit('event-retry')" >Tentar novamente</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';

export default {
    emits: ["event-retry", "event-back"],
    props: {
        isLoading: Boolean,
        error: [Error, String],
        position_relative: {
            type: Boolean,
            required: false,
            default: () => false
        },
        width: {
            type: Number,
            required: false,
            default: 50
        }
    },
    setup(props){
        const showButtonRetry = ref(true);
        const showButtonBack = ref(false)
        const errorMsg = ref("")

        watch(() => props.error, error => defineError(error))
        onMounted(() => defineError(props.error))

        function defineError(error){
            if(!error) 
                return errorMsg.value = ""

            if(typeof error === "string")
                return errorMsg.value = error;
            
            if (error.response) {
                if(error.response.data.name === "GesconError"){
                    errorMsg.value =  error.response.data.message;
                }else {
                    errorMsg.value =  "Ops, ocorreu um problema"
                }
            }else if (error.request) {
                if (error.message === "Network Error") 
                    errorMsg.value =  'Ops, problema com a conexão com a internet, por favor tente novamente!'
                
                errorMsg.value =  'Ops, deu um problema, por favor tente novamente!'  
            } else {
                errorMsg.value =  error.message
            } 
        }

        return {
            errorMsg,
            showButtonRetry,
            showButtonBack
        }
    }
}
</script>

<style lang="less" scoped>
    .loader {
        position: relative;
        margin: 0 auto;
    }

    .circular {
        animation: rotate 2s linear infinite;
        height: 100%;
        transform-origin: center center;
        width: 100%;
    }

    .path {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        animation: dash 1.2s ease-in-out infinite;
        stroke-linecap: round;
        stroke: #f70;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
</style>

<style lang="less" scoped>
    .container-loading{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
        background-color: transparent;
		z-index: 1;
	}

    .container-login-or-error{
        // width: 100vw;
        height: 100%;

        position: absolute;

        display: flex;
        align-content: center;
        align-items: center;
    }
    .spinner-loading {
        border: solid 4px transparent;
        border-bottom: solid 4px #FF7900;
        border-radius: 50%;

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

    .container-msg-error{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 5%
    }
    .text-error{
        margin: 20px 0;
        text-align: center;
        font-size: 1.7em;
    }

    .container-buttons{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .button{
        width: auto;
        height: auto;
        margin: 0;

        margin-bottom: 12px;
        padding: 10px 6px;
        cursor: pointer;
    }
</style>