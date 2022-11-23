<template>
    <div class="expandable-content" :class="{ 'is-expanded': isOpen }" >
        <input type="checkbox" :id="uuid" class="input-select" v-model="isOpen">

        <label :for="uuid" class="label-select">
            <span class="expandable-content-title">{{ title }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </label>
        
        <div class="content-expand">        
          <slot />
        </div>
    </div>
</template>

<script>
export default {
    name:"expandable-content",
    props: {
        title: {
            type: String
        },
        defaultOpen: {
            type: Boolean,
            required: false,
            default: () => false
        }
    },
    computed: {
        uuid(){
            // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916
            const S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }
    },
    data(){
        return{
            isOpen: false
        }
    },
    mounted(){
        this.isOpen = this.defaultOpen
    }
}
</script>

<style lang="less" scoped>
   .expandable-content{
        transition: 120ms ease-in;
        border-radius: 5px;
    }
    
    .label-select {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: #fff;

        transition: 120ms;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        svg {
            transition: 250ms;
            transform: rotate(180deg);
        }
    }

    .expandable-content-title{
        font-size: 2em;
        font-weight: bold;
        color: rgb(49, 49, 49);
    }
 

    .input-select {
        display: none;
        &:checked + .label-select{
            margin-bottom: 22px;
        }
        &:checked+.label-select>svg {
            transform: rotate(0);
        }
        &:checked~.content-expand {
            height: auto;
            border: none;
            overflow:initial !important;
            // padding-bottom: 20px;
        }
    }

    .content-expand {
        width: 100%;
        height: 0;
        overflow: hidden;
        position: relative;
    }
</style>