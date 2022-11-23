<template>
    <div class="date-range">
        <div class="datepicker-static" >
            <div class="period-view">
                <div class="content-period-view" @click="show">
                    <span>{{ startDate }}</span>
                    <div class="separator"></div>
                    <span>{{ endDate }}</span>
                </div>
                <button class="btn-close" @click="handleResetDates">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </button>
            </div>
        </div>

        <div class="container-popup" v-if="state.isShow" @click="onClickHandle">
            <div class="content-popup">
                <div class="close no_highlights" @click="close">&#x2715;</div>
                <div class="ctn_left">
                    <ul class="periods">
                        <li v-for="p of state.periods.list" :key="p" class="period-item" :class="{ 'active': state.periods.active === p.key }" @click="setPeriod(p.key)">{{ p.value }}</li>
                    </ul>
                </div>
                <div class="ctn_right">

                    <div class="datepicker-header">
                        <div class="datepicker-inputs">
                            <div class="input-group-new">
                                <div class="ctn_input">
                                    <input autocomplete="off" type="date" class="input-date-popup" name="start-date" placeholder="dd-mm-yyyy" :value="PstartDate" @blur="setDate">
                                </div>
                                <div class="separator"></div>
                                <div class="period d-none"></div>
                                <div class="ctn_input">
                                    <input autocomplete="off" type="date" class="input-date-popup" name="end-date" placeholder="dd-mm-yyyy" :value="PendDate" @blur="setDate2">
                                </div>
                            </div>
                        </div>
                    </div>

                    <Datepicker 
                        class="Datepicker"
                        v-model="state.date" 
                        inline 
                        range 
                        multiCalendars 
                        multiCalendarsSolo 
                        format="MM/yyyy" 
                        locale="pt-br" 
                        monthNameFormat="long" 
                        menuClassName="menu-class-name" 
                        calendarCellClassName="dp-custom-cell"
                        autoApply
                        :enableTimePicker="false" />

                    <div class="datepicker-footer">
                        <button class="button button-tertiary text-medium" @click="close">Cancelar</button>
                        <button class="button button-primary text-medium" @click="submit">Selecionar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from "dayjs"

import { computed, reactive } from 'vue';
import { useStore as useStoreHistory }  from "@/store/history.js"

export default {    
    name: "date-range",
    components: { Datepicker },
    props: {
        start_date: {
            type: String,
            required: true,
            default: ""
        },
        end_date: {
            type: String,
            required: true,
            default: ""
        }
    },
    setup(props, { emit }){
        const history = useStoreHistory()
        const state = reactive({
            isShow: false,
            date: [],
            periods: {
                active: "",
                list: [
                    { key: "this_month", value: "Esse mês" },
                    { key: "last_month", value: "Último mês" },
                    { key: "next_month", value: "Próximo mês" },
                    { key: "last_30_days", value: "Últimos 30 dias" },
                    { key: "last_90_days", value: "Últimos 90 dias " },
                    { key: "next_3_months", value: "Próximos 3 meses" },
                    { key: "last_3_months", value: "Últimos 3 meses" },
                    { key: "next_6_months", value: "Próximos 6 meses" },
                    { key: "last_6_months", value: "Últimos 6 meses" },
                ]
            },
        })

        const startDate = computed(() => {
            if(!props.start_date) return "--/--/----"
            return dayjs(props.start_date).format("DD/MM/YYYY")
        })
        const endDate = computed(() => {
            if(!props.end_date) return "--/--/----"
            return dayjs(props.end_date).format("DD/MM/YYYY")
        })
        const PstartDate = computed(() => { 
            const d = state.date[0] ? new Date(state.date[0]) : new Date(props.start_date)
            return `${ d.getFullYear() }-${ d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1 ): d.getMonth() + 1 }-${ d.getDate() < 10 ? "0" + d.getDate() : d.getDate() }`
        })
        const PendDate = computed(() => {
            const d = state.date[1] ? new Date(state.date[1]) : new Date(props.end_date)
            return `${ d.getFullYear() }-${ d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1 ): d.getMonth() + 1 }-${ d.getDate() < 10 ? "0" + d.getDate() : d.getDate() }`
        })

        function setPeriod(key){
            state.periods.active = key;

            switch(key){
                case "this_month":
                    state.date[0] = dayjs().startOf("month").format()
                    state.date[1] = dayjs().endOf("month").format()
                    break
                case "last_month":
                    state.date[0] = dayjs().subtract(1,"month").startOf("month").format()
                    state.date[1] = dayjs().subtract(1,"month").endOf("month").format()
                    break
                case "next_month":
                    state.date[0] = dayjs().add(1,"month").startOf("month").format()
                    state.date[1] = dayjs().add(1,"month").endOf("month").format()
                    break
                case "last_30_days":
                    state.date[0] = dayjs().subtract(30,"day").format()
                    state.date[1] = dayjs().format()
                    break 
                case "last_90_days":
                    state.date[0] = dayjs().subtract(90,"day").format()
                    state.date[1] = dayjs().format()
                    break 
                case "next_3_months":
                    state.date[0] = dayjs().startOf("month").format()
                    state.date[1] = dayjs().add(3,"month").endOf("month").format()
                    break 
                case "last_3_months":
                    state.date[0] = dayjs().subtract(3,"month").startOf("month").format()
                    state.date[1] = dayjs().endOf("month").format()
                    break 
                case "next_6_months":
                    state.date[0] = dayjs().startOf("month").format()
                    state.date[1] = dayjs().add(6,"month").endOf("month").format()
                    break 
                case "last_6_months":
                    state.date[0] = dayjs().subtract(6,"month").startOf("month").format()
                    state.date[1] = dayjs().endOf("month").format()
                    break 
            }
        }
        function submit(){
            emit("event-set", {
                start: dayjs(state.date[0]).format("YYYY-MM-DD"),
                end: dayjs(state.date[1]).format("YYYY-MM-DD")
            })
            close()
        }

        function setDate(evt){
            const date = evt.target.value
            if(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date))
                state.date[0] = new Date(date).toISOString()
        }
        function setDate2(evt){
            const date = evt.target.value
            if(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date))
                state.date[1] = new Date(date).toISOString()
        }
        function onClickHandle(evt){
            if(evt.target.classList.contains("container-popup"))
                close()
        }
        function show(){
            history.push({ name: "modal_date_range", fn: close })
            state.isShow = true
            state.date = []
        }
        function close(){
            history.remove("modal_date_range")
            state.isShow = false
        }

        function handleResetDates(){
            state.date[0] = ""
            state.date[1] = ""
            emit("event-set", {
                start: "",
                end: ""
            })
            close()
        }

        return {
            state,
            // 
            startDate,
            endDate,
            PstartDate,
            PendDate,
            // methods
            setPeriod,
            submit,
            setDate,
            setDate2,
            onClickHandle,
            show,
            close,
            handleResetDates
        }
    }
}
</script>

<style lang="less" scoped>
    .list-filter-by-date{
        height: 40px;
        display: flex;
        align-items: center;

        li {
            font-size: 1.7em;
            margin-right: 16px;
            cursor: pointer;
            color: #ff9232;

            &:hover{
                text-decoration: underline;
            }

            &:last-child{
                margin-right: 0;
            }
        }
    }
    .selected{
        font-weight: bold;
        text-decoration: underline;
    }
    .datepicker-static{
        width: 100%;
        border: solid 1px #EBECED;
        padding: 0 10px;
    }
    .period-view{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content-period-view{
        width: calc(100% - 34px);
        font-size: 1.7em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;

        span{
            font-size: 1em;
            display: block;
        }
    }
    .btn-close{
        border: none;
        cursor: pointer;
        transition: 120ms ease;

        &:active{
            transform: scale(.8)
        }
    }

    .container-popup{
        width: 100%;
        height: 100vh;

        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;

        background-color: rgba(0, 0, 0, .4);

        display: flex;
        justify-content: center;
        align-items: center;    
    }

    .content-popup{
        min-height: 384px;
        max-height: 86vh;
        overflow: hidden auto;

        margin: 0 20px;
        background-color: #fff;
        border-radius: 5px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;

        position: relative;

        padding-left: 180px;
    }

    .ctn_left{
        width: 180px;
        height: 100%;

        background-color: #EBECED;
        padding: 24px 12px;
        
        position: absolute;
        top: 0;
        left: 0;
    }
    .period-item{
        font-size: 1.6em;
        cursor: pointer;

        display: inline-block;
        color: inherit;
        border: none;
        padding: 4px 8px;
        border-radius: 2px;
        line-height: 24px;
        background-color: transparent;
        margin-bottom: 4px;
        text-decoration: none;

        &:hover, &:focus{
            background-color: rgba(102,122,152,0.1);
            text-decoration: none;
        }
    }

    .active{
        color: #fff;
        background-color: #f70 !important;
    }

    .ctn_right{
        width: 100%;
        max-width: 542px;
        height: 100%;
        font-size:  17px !important;

        display: flex;
        align-items: center;
        flex-direction: column;

        padding: 20px;
    }
    .datepicker-header{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        margin-bottom: 16px;
        // width: 100%;
        // max-width: 500px;
    }

    .input-group-new{
        margin-bottom: 0;
        padding: 4px;
        border: 1px solid #EBECED;
        border-radius: 2px;
        display: flex;
        align-items: center;
    }
    .separator{
        width: 16px;
        height: 40px;
        border-top: 1px solid #d5dbe4;
        border-bottom: 1px solid #d5dbe4;
        display: block;
        align-items: center;
        background-color: #fff;
        position: relative;
        flex-shrink: 0;
        flex-grow: 0;
        border: none;
        margin: 0 16px;

        &::after{
            display: block;
            content: " ";
            width: 10px;
            height: 2px;
            background-color: #667A98;
            z-index: 10;
            position: absolute;
            top: calc(50% - 1px);
            left: calc(50% - 5px);
        }
    }
    
    .ctn_input{
        flex-grow: 1;
    }
    .input-date-popup{
        width: 100%;
        height: 40px;
        font-size: 1.7em;
        border-radius: 2px;
        text-align: center;
        border: 1px solid gray;

        &:focus{
            border: 1px solid #f70;
            box-shadow: inset 0px 0px 8px rgba(255, 119, 0, 0.4);
        }
    }

    .close{
        font-size: 2.8em;
        cursor: pointer;
        color: gray;
        position: absolute;
        top: 2px;
        right: 6px;
        &:active{
            transform: scale(.8)
        }
    }
    :deep(.menu-class-name){
        width: 100%;
        * > {
            font-size: 15px !important;
        }
    }
    :deep(.dp__theme_light){
        --dp-primary-color: #f70;
    }


    .datepicker-footer{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 12px;

        .button{
            width: 120px;
            height: 40px;

            margin-left: 12px;
        }
    }


    @media screen and (max-width: 760px){
        .content-popup{
            flex-direction: column;
            padding-left: 0;
        }
        .ctn_left{
            width: 100%;
            height: 48px;
            overflow-x: auto;
            position: relative;
            display: none;
        }
        .periods{
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            align-items: center;
            li{
                white-space: nowrap;

                border-right: dashed 1px gray;

                &:last-child{
                    border: none;
                }
            }
        }
        .Datepicker{
            display: none;
        }
    }
    @media screen and (max-width: 500px){
        .datepicker-header, .datepicker-inputs{
            width: 260px;
        }
        .ctn_input{
            width: 100%;
        }
        .input-group-new{
            width: 100%;
            flex-direction: column;
            padding: 12px;
        }
    }
</style>