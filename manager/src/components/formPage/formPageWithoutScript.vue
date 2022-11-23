<template>
    <div class="form-page" :class="{ 'not-footer': !showFooter }"> 
        <div class="header">
            <div class="content-header">
                <button class="button-back" @click="goBack" >
                    <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                <div class="title">
                    <p>{{ title }}</p>
                </div>
            </div>
        </div>

        <div class="body">
            <div class="content-body" :style="contentStyle">
                <loading-or-error :isLoading="isLoading" :error="error" @event-retry="$emit('event-retry')" style="background-color: #fff"/>
                <slot />
            </div>
        </div>

      
        <div class="footer" v-show="showFooter">
            <div class="content-footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router"

export default {
    props: {
        title: {
            type: String,
            required: false,
            default: "Voltar"
        },
        linkBack: {
            type: String,
            required: false
        },
        isLoading: Boolean,
        error: [String, Error],
        showFooter: {
            type: Boolean,
            required: false,
            default: () => true
        },
        contentStyle: {
            type: String,
            required: false,
            default: "max-width: 1000px"
        }
    },
    setup(props){

        const $route = useRoute();
        const $router = useRouter()

        function goBack(){
            const { previous } = $route.query;
            $router.replace(previous || props.linkBack)
        }

        return {
            goBack,
        }
    }
}
</script>
<style lang="less" scoped >
    
    .form-page{
        background-color: #e6e6e6;

        display: grid;
        grid-template-areas: "header" "body" "footer";
        grid-template-columns: 100%;
        grid-template-rows: 56px calc(100vh - 55px - 64px) 64px;
    }  

    .not-footer{
        grid-template-areas: "header" "body";
        grid-template-rows: 56px calc(100vh - 55px);
    }
    
    .header{
        grid-area: header;
        position: relative;
        width: 100%;
        height: 56px;
        border-bottom: solid 1px #d7d7d7;
        background-color: #fff;
    }

    .content-header{
        width: 100%;
        max-width: 1000px;
        height: 100%;
        margin: 0 auto;

        display: grid;
        grid-template-areas: "back title popup";
        grid-template-columns: 30px 1fr 30px;
        column-gap: 16px;
      
        & > *{
            align-self: center;
        }

        position: relative
    }
  
    .button-back{
        grid-area: back;

		width: 30px;
		height: 30px;
        border: none;
        background-color: #fff;
        transition: 150ms;

        margin-right: 8px;
        &:active{
            transform: scale(.8);
        }
        &>svg{
            width: 30px;
            height: 30px;
        }
	}

    .title{
        grid-area: title;
        overflow: hidden;
        p{
            white-space: nowrap;
            font-size: 2em;
            font-weight: bold;
        }
    }

    .body{
        grid-area: body;
        width: 100%;
        height: 100;
        // height: calc(100vh - 56px);
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
    }
    .content-body{
        max-width: 1000px;
        margin: 0 auto;
        min-height: 100%;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        position: relative;
    }
    .footer{
        grid-area: footer;
        width: 100%;
        height: 64px;
        background-color: #fff;
        border-top: solid 1px #d7d7d7;
        padding: 0 20px;
    }
    .content-footer{
        width: 100%;
        max-width: 1000px;
        height: 100%;

        margin: 0 auto;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
    }

    @media screen and (max-width:1000px) {
        .content-header{
            padding:0 10px;
        }
        .body, .content-body, .footer{
            padding: 14px;
        }
    }
</style>
