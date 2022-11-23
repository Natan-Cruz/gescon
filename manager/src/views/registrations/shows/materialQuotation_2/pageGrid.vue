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

        <div class="sub-grid" :class="{ translated: translated }">
            <div class="left">
                <div class="content">

                    <div class="content-header">
                        <p class="title">{{ left_title }}</p>
                        <button class="btn" @click="translated = true">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8.025 22 6.25 20.225 14.475 12 6.25 3.775 8.025 2l10 10Z"/></svg>
                        </button>
                    </div>
                    
                    <div class="grouping">
                        <slot name="left"/>
                    </div>

                </div>
            </div>
            <div class="right">
                <div class="content">

                    <div class="content-header" style="justify-content: flex-start;">
                        <button class="btn" style="margin-right: 12px" @click="translated = false">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" style="transform: rotate(180deg); "><path d="M8.025 22 6.25 20.225 14.475 12 6.25 3.775 8.025 2l10 10Z"/></svg>
                        </button>

                        <p class="title">{{ right_title }}</p>
                    </div>
                    
                    <div class="grouping">
                        <slot name="right"/>
                    </div>

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
import { ref } from '@vue/reactivity';
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
        },
        left_title: String,
        right_title: String,
    },
    setup(props){
        const $route = useRoute();
        const $router = useRouter()
        const translated = ref(false)

        function goBack(){
            const { previous } = $route.query;
            $router.replace(previous || props.linkBack)
        }

        return {
            goBack,
            translated
        }
    }
}
</script>
<style lang="less" scoped >
    
    .form-page{
        background-color: #e6e6e6;

        display: grid;
        grid-template-areas: "header" "sub_grid" "footer";
        grid-template-columns: 100%;
        grid-template-rows: 56px calc(100vh - 55px - 64px) 64px;
    }  
    .sub-grid{ grid-area: sub_grid; align-self: center; justify-self: center;}

    .not-footer{
        grid-template-areas: "header" "sub_grid";
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

    .sub-grid{
        width: 100%;
        max-width: 1200px;
        height: 100%;
        overflow: hidden;
        display: grid;
        grid-template-areas: "c_left c_right";
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 100%;

        transition: 360ms ease-in-out;
    }
   

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

    .content-header{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;

        border-bottom: solid 1px rgb(218, 218, 218);
        box-shadow: 0 3px 5px -2px #f1f1f1;
        padding-bottom: 8px;

        .title{
            font-size: 1.9em;
            font-weight: bold;
        }

        .btn{
            width: 30px;
            height: 30px;
            display: none;

            border: none;
            border-radius: 50%;
            background-color: #fff;
            transition: 120ms ease;

            &:active{
                transform: scale(.8);
                background-color: rgb(189, 189, 189);
            }
        }
    }


    .grouping{
        width: 100%;
        height: calc(100% - 35px);
        overflow: hidden auto;

        padding-top: 12px;
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
        .body, .content-body, .footer{
            padding: 14px;
        }
        .translated{
            transform: translateX(-50%);
        }
        .sub-grid{
            width: calc(200%);
            grid-template-areas: "c_left c_right";
            grid-template-columns: 1fr 1fr;
        }
        .left{ padding: 10px 5px 10px 10px;}
        .right{ padding: 10px 10px 10px 5px;}

        .content-header .btn{
            display: block;
        }
    }
</style>
