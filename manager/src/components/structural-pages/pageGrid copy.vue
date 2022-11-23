<template>
    <div class="form-page" :class="{ 'not-footer': !showFooter }"> 
        <div class="header">
            <button class="button-back" @click="goBack" >
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>

            <div class="title">
                <p>Voltar</p>
            </div>
        </div>

        <loading-or-error :isLoading="isLoading" :error="error" @event-retry="$emit('event-retry')" style="background-color: #fff"/>

        <div class="sub-grid">
            <div class="left">
                <div class="content">
                    <slot name="left"/>
                </div>
            </div>
            <div class="right">
                <div class="content">
                    <slot name="right"/>
                </div>
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
        grid-template-areas: "header" "sub_grid" "footer footer";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 56px calc(100vh - 55px - 64px) 64px;
    }  

    .not-footer{
        grid-template-areas: "header header" "c_left c_right";
        grid-template-rows: 56px calc(100vh - 55px);
    }
    
    .header{
        grid-area: header;

        position: relative;
        width: 100%;
        height: 56px;
        border-bottom: solid 1px #d7d7d7;
        background-color: #fff;

        display: flex;
        align-items: center;
        padding: 0 20px ;
    }
  
    .button-back{
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
        overflow: hidden;
        p{
            white-space: nowrap;
            font-size: 2em;
            font-weight: bold;
        }
    }   

    // content

    .left{ grid-area: c_left; padding: 20px 10px 20px 20px;}
    .right{ grid-area: c_right; padding: 20px 20px 20px 10px;}
    .left, .right{
        width: 100%;
        height: 100%;
    }
    .content{
        background-color: #fff;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        position: relative;
        padding: 10px;
    }


    // footer
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

        .form-page{
            grid-template-areas: "header header header header" "c_left c_left c_right c_right" "footer footer footer footer";
            grid-template-columns: 1fr 1fr;
        }
    }
</style>
