<template>
    <div class="container-loading" :class="{ 'center': isLoading }" v-if="(isLoading || errorMsg)">

        <span v-show="isLoading" class="spinner-loading"></span>

        <div class="container-msg-error" v-show="errorMsg">
			<p class="text-error">{{ errorMsg }}</p>
		</div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';

export default {
    props: {
        isLoading: Boolean,
        error: [Error, String]
    },
    setup(props){
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
        }
    }
}
</script>

<style lang="less" scoped>
    .container-loading{
		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
        background-color: rgba(255, 255, 255, .6);
		z-index: 1;

        margin-bottom: 24px;
	}

    .center{
        height: 100%;
        position: absolute;
        display: flex;
        top: 0;
        left: 0;
    }
    .spinner-loading {
        width: 40px;
        height: 40px;

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
        height: auto;
        background-color: #FF9494;
        padding: 10px;
    }
    .text-error{
        font-size: 1.7em;
        color: #6b081c
    }
</style>