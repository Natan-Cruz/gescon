<template>
    <div class="wrapper-component" :class="{ 'show_button_remove': show_button_remove }">
        <div class="transaction-header">
            <p class="sub-title">{{ title }}  <span v-if="little_expanation" class="little-explanation"> - {{ little_expanation }}</span></p>

            <button v-if="show_button_remove" class="button-trash" @click="$emit('event-remove')" title="Remover item">
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
            </button>
        </div>

        <div class="slot-content" style="padding: 20px 10px 0 10px">
            <slot />
        </div>
    </div>
</template>

<script>

export default {
    props: {
        title: { type: String },
        little_expanation: { type: String },
        show_button_remove: { type: Boolean }
    }
}
</script>

<style lang="less" scoped>
    .transaction-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(230, 230, 230);
        padding: 10px;
    }
   
    .sub-title{
        font-size: 1.6em;
        color: rgb(0, 0, 0);
        font-weight: bold;
        margin-top: 24px;

        &:first-child{
            margin-top: 0;
        }
    }
    .little-explanation {
        font-weight: normal;
        font-size: .95em;
        opacity: .6;
    }
   
    .button-trash{
        width: 42px;
        height: 42px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

        position: absolute;
        top: 10px;
        right: 15px;

        cursor: pointer;

        transition: 80ms ease-in;

        &:hover{
            background-color: rgb(206, 206, 206);
        }

        &:active{
            background-color: rgb(179, 179, 179);
            transform: scale(.96);
        }
    }

    @media screen and (min-width: 800px) {
        .wrapper-component{
            display: flex;
            column-gap: 10px;
            border-bottom: solid 1px gray;
            
           
        }
        .transaction-header{
            width: 230px;
            align-items: flex-start;
            background-color: #fff;
        }
        .show_button_remove{
            border-top: none;

            .sub-title{
                margin-left: 50px;
                margin-top: 10px;
            }

            .button-trash{
                left: 0;
            }
            
        }
        .slot-content{
            width: calc(100% - 230px);
        }
    }
</style>