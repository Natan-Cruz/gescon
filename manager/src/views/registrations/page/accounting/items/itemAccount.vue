<template>
    <li class="item grid" @click="handleSelect" :class="classGrid">
        <span class="detail" :class="accountTypeClass" :style="computedStyle"></span>

        <input class="checkbox" type="checkbox" :checked="account.isChecked" @change="handleIsChecked">

        <div class="description">
            <div class="desc">
                <span>{{ account.name }}</span>
                <!-- <span v-if="account.installment_information" style="color: gray; margin-right: 2px;">{{ account.installment_information }} - </span> -->
                <span v-if="account.cost_center_name" style="color: gray">{{ account.cost_center_name }}</span>
            </div>
            <div v-if="account.entity_name" class="entity_name">
                <p>{{ account.entity_name }}</p>
            </div>
            <div class="info" v-show="bankSlip.textFrag">
                <span class="ctn-message" :class="bankSlip.styleClass">{{ bankSlip.textFrag }}</span>
            </div>
        </div>

        <span class="frequency">{{ frequency }}</span>


        <div class="amount" style="position:">
            <popup-values class="amount" 
                :account_type="account.type" 
                :paid_at="account.paid_at"
                :forecast_amount="account.forecast_amount"
                :amount="account.amount"
                :fees="account.fees"
                :corrections="account.corrections"
                :fine="account.fine" />
        </div>

        <div class="dates">
            <p>{{ formatDate(date, "DD/MM/YY") }}</p>
            <p>{{ formatDate(date, "dddd") }}</p>
        </div>

        <div class="buttons">
            <button v-if="account.paid_at ? false : true" class="btn action" title="Menu rápido">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 20q-.825 0-1.412-.587Q4 18.825 4 18q0-.825.588-1.413Q5.175 16 6 16t1.412.587Q8 17.175 8 18q0 .825-.588 1.413Q6.825 20 6 20Zm6 0q-.825 0-1.412-.587Q10 18.825 10 18q0-.825.588-1.413Q11.175 16 12 16t1.413.587Q14 17.175 14 18q0 .825-.587 1.413Q12.825 20 12 20Zm6 0q-.825 0-1.413-.587Q16 18.825 16 18q0-.825.587-1.413Q17.175 16 18 16q.825 0 1.413.587Q20 17.175 20 18q0 .825-.587 1.413Q18.825 20 18 20ZM6 14q-.825 0-1.412-.588Q4 12.825 4 12t.588-1.413Q5.175 10 6 10t1.412.587Q8 11.175 8 12q0 .825-.588 1.412Q6.825 14 6 14Zm6 0q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm6 0q-.825 0-1.413-.588Q16 12.825 16 12t.587-1.413Q17.175 10 18 10q.825 0 1.413.587Q20 11.175 20 12q0 .825-.587 1.412Q18.825 14 18 14ZM6 8q-.825 0-1.412-.588Q4 6.825 4 6t.588-1.412Q5.175 4 6 4t1.412.588Q8 5.175 8 6t-.588 1.412Q6.825 8 6 8Zm6 0q-.825 0-1.412-.588Q10 6.825 10 6t.588-1.412Q11.175 4 12 4t1.413.588Q14 5.175 14 6t-.587 1.412Q12.825 8 12 8Zm6 0q-.825 0-1.413-.588Q16 6.825 16 6t.587-1.412Q17.175 4 18 4q.825 0 1.413.588Q20 5.175 20 6t-.587 1.412Q18.825 8 18 8Z"/></svg>
            </button>
            <button v-can="deletePermissions" v-if="isTransaction" class="btn delete" title="Remover conta" >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.4 16.5 2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6L16 9.9l-1.4-1.4-2.6 2.6-2.6-2.6L8 9.9l2.6 2.6L8 15.1ZM7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM7 6v13Z"/></svg>
            </button>
        </div>
    </li>
</template>

<script>
import { formatCurrency, formatDate } from "@/Utils/index.js"
import { computed } from 'vue';
import dayjs from 'dayjs';
import popupValues from "../components/popupValues.vue"

export default {
    components: { popupValues },
    props: { account: Object, classGrid: String, account_type: String },
    setup(props, { emit }){
        const isTransaction = computed(() => Object.prototype.hasOwnProperty.call(props.account, "recurrence_template_id"))
        const computedStyle = computed(() => props.account.paid_at ? 'opacity: 1' : 'opacity: 0.7')
        const accountTypeClass = computed(() => "detail-" + props.account.type)
       
        const date = computed(() => {
            let d;
            switch(props.account_type){
                case "bills_to_pay": 
                case "bills_to_receive":
                    d = props.account.due_date; break
                case "paid_bills":
                case "accounts_received": 
                    d = props.account.paid_at; break
            }
            return d
        })
     
        const frequency = computed(() => {
            let f;
            switch(props.account.frequency){
                case "daily": f = 'Diário'; break
                case "weekly": f = 'Semanal'; break
                case "monthly": f = 'Mensal'; break
                case "yearly": f = 'Anual'; break
                case "every_two_months": f = 'Bimestral'; break;
                case "every_three_months": f = 'Trimestral'; break;
                case "every_four_months": f = 'Quadrimestral'; break;
                case "every_six_months": f = 'Semestral'; break;
                default: f = "Única"
            }
            return f
        })

        const bankSlip = computed(() => {
            let styleClass, textFrag;
             
            const { slip_id, slip_due_date, slip_paid_date } = props.account

            if(!slip_id)
                return { styleClass, textFrag }
                
            if(slip_paid_date){
                textFrag = "Boleto pago"
                styleClass = "bank-slip-paid"
            }else
            if(dayjs().isAfter(slip_due_date)){
                textFrag = "Boleto vencido"
                styleClass = "expired-bank-slip"
            }else{
                textFrag = "Boleto enviado"
                styleClass = "bank-slip-sent" 
            }

            return { styleClass, textFrag }
        })

        const deletePermissions = [
            "delete:bills_to_pay",
            "delete:bills_to_receive",
            "delete:paid_bills",
            "delete:accounts_received",
        ]


        function handleSelect(evt){
            if(evt.target.closest(".checkbox") || evt.target.closest(".amount"))
                return;

            if(evt.target.closest(".action"))
                emit("open-modal-fast-access", props.account)
            else if(evt.target.closest(".delete"))
                emit("delete-account", props.account.id)
            else
                emit("select-account", props.account.uuid || props.account.id)
        }

        function handleIsChecked(evt){
            const isChecked = evt.target.checked;
            emit("event-toggle-item", { id: props.account.id, isChecked: isChecked })
        }
    
        return {
            // style
            accountTypeClass,
            // values
            frequency,
            date,
            bankSlip,
            // boolean
            isTransaction,
            computedStyle,
            // methods
            formatCurrency,
            handleSelect,
            formatDate,
            handleIsChecked,
            deletePermissions
        }
    }
}
</script>

<style lang="less" scoped> 
    @inflow-color: #287928;
    @outflow-color: #F51720;
    .grid{
        display: grid;
        grid-template-rows: auto;
        column-gap: 18px;
    }
    // contas a pagar
    .forecast_accounts{ 
        grid-template-areas: "detail checkbox description frequency amount dates buttons";
        grid-template-columns: 4px 16px 400px 120px minmax(120px, min-content) 120px 1fr;

        .frequency, .buttons{
            display: flex;
        }
    }
    // contas pagas
    .realized_accounts{ 
        grid-template-areas: "detail checkbox description amount dates buttons";
        grid-template-columns: 4px 16px 400px minmax(120px, min-content) 120px 1fr;

        .frequency{
            display: none;
        }
    }

    .item{
        width: 100%;
        min-height: 70px;
        height: auto;
        border-bottom: solid 1px rgb(150, 150, 150);

        position: relative;
        cursor: pointer;
        padding-right: 20px;
    }

    @media screen and (max-width: 400px){
        .item{
            row-gap: 8px;
        }
        // contas a pagar
        .forecast_accounts{ 
            grid-template-areas: 
                "detail checkbox description description buttons" 
                "detail checkbox amount dates buttons";
            grid-template-columns: 4px 16px auto repeat(2, 1fr);
            grid-template-rows: auto auto;

            .frequency{
                display: none;
           }
        }
        // contas pagas
        .realized_accounts{ 
            grid-template-areas: 
                "detail checkbox description description buttons" 
                "detail checkbox amount dates buttons";
            grid-template-columns: 4px 16px repeat(3, 1fr);
            grid-template-rows: auto auto;

            .frequency{
                display: none;
            }
        }

        .description{
            padding-top: 10px;
        }

        .date:last-child{ display: none; }
    }
    .detail{ grid-area: detail; }
    .checkbox{ grid-area: checkbox; }
    .description{ grid-area: description; }
    .frequency{ grid-area: frequency; }
    .amount{ grid-area: amount; height: 100% }
    .dates{ grid-area: dates; }
    .buttons{ grid-area: buttons; }


    // detail
    .detail{
        display: block;
        width: 100%;
        height: 100%;
    }
    .detail-inflow{
        background-color: @inflow-color;
    }
    .detail-outflow{
        background-color: @outflow-color;
    }

    // checkbox
    .checkbox{
        width: 16px;
        height: 16px;
        align-self: center;
    }

    // general
    .description,
    .amount,
    .dates,
    .frequency{
        font-size: 1.5em;
        align-self: center;
        white-space: nowrap;
    }

    // description
    .description{
        .desc{
            font-size: 1em;
        }
        span{
            font-size: 1em;

            &:first-child{
                margin-right: 6px;
            }
        }
    }
    .entity_name{
        p{
            font-size: 1.3em;
            color: rgb(105, 105, 105);
            position: relative;
            padding-left: 10px;
            margin-top: 2px;

            &::before{
                content: "";
                display: block;

                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: gray;

                position: absolute;
                left: 0;
                top: 5px;
            }
        }
    }

    // frequency
    .frequency{
        color: rgb(105, 105, 105);
    }

    // dates
    .dates{
        align-self: center;
        p{
            font-size: 1em;
            color: rgb(80, 80, 80);
        }
    }

    // buttons
    .buttons{
        align-self: center;
        justify-self: center;
    }
    .btn{
        width: 40px;
        height: 40px;
        border: none;
        background-color: #fff;
        align-self: center;
        cursor: pointer;

        &:active{
            transform: scale(.8);
        }
    }

    // info
    .info{
        padding-bottom: 6px;
        font-size: 1em;
        margin-top: 6px;
    }
    .ctn-message{
        font-size: 1.5em;
        border-radius: 10px;
        padding: 0 10px;
    }
    .bank-slip-paid{
        background-color: #319210;
        color: #fff;
    }
    .bank-slip-sent{
        background-color: #5353ec;
        color: #fff;
    }
    .expired-bank-slip{
        background-color: #ff4b37;
        color: #fff;
    }
</style>