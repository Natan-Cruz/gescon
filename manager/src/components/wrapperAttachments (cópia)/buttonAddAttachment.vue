<template>
    <div class="wrapper-button-add-attachment">
        <div class="background-disabled" v-if="disabled"></div>    

        <label :for="_id" class="button button-second btn-add-attachments" >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
            </svg>
            Adicionar anexos
        </label>
        <input type="file" :id="_id" @input="$emit('event-load-file', $event)" multiple="multiple" style="display:none" :disabled="disabled">
    </div>
</template>

<script>
export default {
    name: "button-add-attachment",
    props: {
        disabled:  Boolean
    },
    computed: {
        _id(){
            return 'input-attachment_' + Math.random().toString(36).substr(2, 9);
        }
    },
}
</script>

<style lang="less" scoped>
    .wrapper-button-add-attachment{
        width: 180px;
        position: relative;
    }
    
    .background-disabled{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(196, 196, 196, 0.322);
        z-index: 1;
    }
    
    .btn-add-attachments{
        width: 100%;
        height: 34px;
        font-size: 1.6em;
        margin-right: 15px;
        &>svg{
            transition: 250ms;
            fill: #FF7900;
            margin-right: 10px;
        }
        &:hover{
            &>svg{
                fill: #fff !important;        
            }
        }
    }
</style>