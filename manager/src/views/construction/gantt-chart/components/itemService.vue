<template>
    <div class="item-service">

        <div class="content-item-service">
            <input type="checkbox" class="checkbox" :value="item.data.isOpen" @change="handleCheckbox($event.target.checked)">

            <input type="checkbox" :id=" item.data.id + 'eye' " style="display: none" :value="item.data.isShow" @change="handleCheckboxEye($event.target.checked)">
            <label class="eye" :for=" item.data.id + 'eye' ">
                <!-- visibility -->
                <span v-show="item.data.isShow !== false">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M10 13.5q1.458 0 2.479-1.021Q13.5 11.458 13.5 10q0-1.458-1.021-2.479Q11.458 6.5 10 6.5q-1.458 0-2.479 1.021Q6.5 8.542 6.5 10q0 1.458 1.021 2.479Q8.542 13.5 10 13.5Zm0-1.5q-.833 0-1.417-.583Q8 10.833 8 10q0-.833.583-1.417Q9.167 8 10 8q.833 0 1.417.583Q12 9.167 12 10q0 .833-.583 1.417Q10.833 12 10 12Zm0 4q-2.979 0-5.417-1.635Q2.146 12.729 1 10q1.146-2.729 3.583-4.365Q7.021 4 10 4q2.979 0 5.417 1.635Q17.854 7.271 19 10q-1.146 2.729-3.583 4.365Q12.979 16 10 16Zm0-6Zm0 4.5q2.333 0 4.312-1.208 1.98-1.209 3.042-3.292-1.062-2.083-3.042-3.292Q12.333 5.5 10 5.5T5.688 6.708Q3.708 7.917 2.646 10q1.062 2.083 3.042 3.292Q7.667 14.5 10 14.5Z"/></svg>
                </span>
                <!-- visibility off -->
                <span v-show="item.data.isShow === false">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m13.271 11.146-1.292-1.292q.083-.792-.479-1.364-.562-.573-1.354-.49L8.854 6.708q.271-.104.563-.156Q9.708 6.5 10 6.5q1.458 0 2.479 1.021Q13.5 8.542 13.5 10q0 .292-.052.583-.052.292-.177.563Zm2.771 2.771-1.084-1.084q.75-.583 1.365-1.281T17.354 10q-1.021-2.104-3.01-3.302Q12.354 5.5 10 5.5q-.542 0-1.062.062-.521.063-1.021.209L6.708 4.562q.792-.312 1.615-.437T10 4q2.979 0 5.448 1.615Q17.917 7.229 19 10q-.458 1.188-1.219 2.156-.76.969-1.739 1.761ZM16 18.125l-2.708-2.708q-.792.291-1.615.437Q10.854 16 10 16q-2.979 0-5.448-1.615Q2.083 12.771 1 10q.458-1.188 1.208-2.167.75-.979 1.75-1.771L1.875 3.979l1.063-1.062 14.124 14.145ZM5.021 7.146q-.729.583-1.354 1.281-.625.698-1.021 1.573 1.021 2.104 3.01 3.302Q7.646 14.5 10 14.5q.542 0 1.062-.073.521-.073 1.042-.198l-.937-.937q-.292.104-.584.156-.291.052-.583.052-1.458 0-2.479-1.021Q6.5 11.458 6.5 10q0-.292.073-.583.073-.292.135-.584ZM11 9Zm-2 2Z"/></svg>
                </span>
            </label>

            <span class="btn-edit" @click="$emit('edit-service', item.data.id)">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M4.25 15.75h1.229l7-7-1.229-1.229-7 7Zm11.938-8.208-3.73-3.73 1.021-1.02q.521-.521 1.24-.521t1.239.521l1.25 1.25q.5.5.5 1.239 0 .74-.5 1.24Zm-1.23 1.229L6.229 17.5H2.5v-3.729l8.729-8.729Zm-3.083-.625-.625-.625 1.229 1.229Z"/></svg>
            </span>
        
            <p class="name">{{ item.data.name }}</p>
            <p class="date start_date">{{ formatDate(item.data.start_date, "DD/MM/YY") }}</p>
            <p class="date end_date">{{ formatDate(item.data.end_date, "DD/MM/YY") }}</p>
        </div>

        <template v-if="item.data.isOpen">
            <div :style="{ paddingLeft: paddingLeft + 'px' }">
                <item-service 
                    v-for="service in item.children" :key="service.data.id" 
                    :item="service"
                    @push="(a,b) => $emit('push', a, b)" />

                <button class="button button-primary button-add">Novo serviço</button>
            </div>
        </template>
    </div>
</template>

<script>
import { formatDate } from "@/Utils/index.js"
import { computed } from 'vue'

export default {
    emits: ["edit-service", "push"],
    props: { item: Object },
    setup(props, { emit }){

        function handleCheckbox(isChecked){
            const service_id = props.item.data.id;

            if(isChecked)
                emit("push", service_id, { isOpen: true })
            else
                emit("push", service_id, { isOpen: false })
        }
        function handleCheckboxEye(isChecked){
            const service_id = props.item.data.id;
            if(isChecked)
                emit("push", service_id, { isShow: true })
            else
                emit("push", service_id, { isShow: false })
        }

        const paddingLeft = computed(() => {
            return props.item.deep * 10
        })

        return {
            paddingLeft,
            // 
            handleCheckbox,
            handleCheckboxEye,
            formatDate
        }
    }
}
</script>

<style lang="less" scoped>
    .item-service{
        height: auto;
    }
    .content-item-service{
        height: 30px;
        padding: 0 10px;
        display: grid;
        grid-template-areas: "checkbox eye btn_edit name start_date end_date";
        grid-template-columns: 15px repeat(2, 20px) 1fr repeat(2, 70px);
        grid-template-rows: auto;
        column-gap: 4px;

        border-bottom: solid 1px rgb(216, 216, 216);
    }
    .checkbox{ grid-area: checkbox; align-self: center; }
    .eye{ grid-area: eye; align-self: center; }
    .btn-edit{ grid-area: btn_edit; align-self: center }
    .name{ grid-area: name; align-self: center; }
    .start_date{ grid-area: start_date; align-self: center; }
    .end_date{ grid-area: end_date; align-self: center; }

    .name{
        font-size: 1.5em;
        font-weight: bold;
        color: gray;
    }
    .date{
        font-size: 1.4em;
        color: gray;
    }
    .button-add{
        font-size: 1.4em;
        width: auto;
        height: auto;
        padding: 4px;
        margin-top: 4px;
    }
</style>