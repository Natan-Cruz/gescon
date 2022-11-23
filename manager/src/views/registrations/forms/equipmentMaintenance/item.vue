<template>
    <li class="item-item">
        <div class="description">
            <wrapper-input id="description" label="Descrição:">
                <textarea-autosize id="description" :minHeight="80" placeholder="A descrição aqui..." v-model="description" :disabled="disabled" />
            </wrapper-input>
        </div>
        <div class="content form_row">
            <!-- start_date -->
            <wrapper-input id="start_date" label="Data de inicio:" >
                <input type="date" class="input" id="start_date" v-model="start_date" :disabled="disabled">
            </wrapper-input>

            <!-- end_date -->
            <wrapper-input id="end_date" label="Data de termino:" >
                <input type="date" class="input" id="end_date" v-model="end_date" :disabled="disabled">
            </wrapper-input>
        </div>

        <div class="attachments">
            <wrapper-attachments class="form_spacing_bottom" 
                v-model="attachments" 
                :id="item.id" 
                :disabled="disabled"/>
        </div>

        <button class="button-trash" @click="remove" v-show="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"

import { computed } from 'vue'
export default {
    name: "item-item",
    emits: ["edit", "remove"],
    components: { wrapperAttachments },
    props: {
        index: Number,
        item: Object,
        disabled: Boolean
    },
    setup(props, { emit }){
        const description = computed({
            get: () => props.item.description,
            set: description => emit("edit", { index: props.index, item: { ...props.item, description }})
        })
        const start_date = computed({
            get: () => props.item.start_date,
            set: start_date => emit("edit", { index: props.index, item: { ...props.item, start_date }})
        })
        const end_date = computed({
            get: () => props.item.end_date,
            set: end_date => emit("edit", { index: props.index, item: { ...props.item, end_date }})
        })
        const attachments = computed({
            get: () => props.item.attachments,
            set: attachments => emit("edit", { index: props.index, item: { ...props.item, attachments }})
        })

        function remove(){
            emit("remove", { index: props.index, item: props.item } )
        }

        return {
            description,
            start_date,
            end_date,
            attachments,
            remove
        }
    }
}
</script>
<style lang="less" scoped>
    .item-item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "description buttonTrash" "content buttonTrash" "attachments attachments";
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, auto);
        row-gap: 16px;
        padding-bottom: 26px;
        margin-bottom: 24px;
        border-bottom: dashed 1px gray;
    }
    .description{
        grid-area: description;
    }
    .attachments{
        grid-area: attachments;
    }
    .content{
        grid-area: content;

        width: 100%;
        height: auto;
    }
    .spacing-bottom{
        margin-bottom: 12px;
        margin-right: 8px;
    }
    .ctn-input{
        grid-area: input;
        width: 100%;
    }
    .input{
        width: 100%;
        font-size: 1.7em;
        height: 42px;
        padding-left: 15px;
        border: 1px solid #a9a9a9;
        border-radius: 8px;
    }
    .button-trash{
        grid-area: buttonTrash;
        align-self: flex-start;

        width: 42px;
        height: 42px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

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
</style>