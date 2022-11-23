<template>
    <li class="item-contact">
        <div class="content row">
            <div>
                <label for="contactPerson" class="label">Pessoa de contato:</label>
                <input type="text" class="input" id="contactPerson" v-model="contactPerson" :disabled="formDisabled">
            </div>

            <div>
                <label for="email" class="label">Email:</label>
                <input type="email" class="input" id="email" v-model="email" :disabled="formDisabled">
            </div>

            <div>
                <label for="commercial_phone" class="label">Telefone comercial:</label>
                <input type="text" class="input" id="commercial_phone" v-model="commercialPhone" :disabled="formDisabled">
            </div>

            <div>
                <label for="cellphone" class="label">Telefone celular:</label>
                <input type="text" class="input" id="cellphone" v-model="cellphone" :disabled="formDisabled">
            </div>

            <div>
                <label for="role" class="label">Cargo:</label>
                <input type="text" class="input" id="role" v-model="role" :disabled="formDisabled"> 
            </div>
        </div>

        <button class="button-trash" @click="remove" v-show="!formDisabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
        
        <!-- <div class="ctn-warning" v-if="showWarningMsg">
            <p class="text-contact">Contato não verificado!</p>

            <button class="btn-verify-contact" @click="sendMsgVerification">Verificar</button>
        </div> -->
    </li>
</template>

<script>
export default {
    name: "item-contact",
    props: {
        index: {
            type: Number
        },
        contact: {
            type: Object
        },
        formDisabled: {
            type: Boolean
        }
    },
    computed: {
        contactPerson: {
            get(){
                return this.contact.contactPerson
            },
            set(contactPerson){
                const contact = Object.assign(this.contact);
                contact.contactPerson = contactPerson
                this.$emit("event-edit-contact", { index: this.index, contact });
            }
        },
        email: {
            get(){
                return this.contact.email
            },
            set(email){
                const contact = Object.assign(this.contact);
                contact.email = email
                this.$emit("event-edit-contact", { index: this.index, contact });
            }
        },
        commercialPhone: {
            get(){
                return this.contact.commercialPhone
            },
            set(commercialPhone){
                const contact = Object.assign(this.contact);
                contact.commercialPhone = commercialPhone
                this.$emit("event-edit-contact", { index: this.index, contact });
            }
        },
        cellphone: {
            get(){
                return this.contact.cellphone
            },
            set(cellphone){
                const contact = Object.assign(this.contact);
                contact.cellphone = cellphone
                this.$emit("event-edit-contact", { index: this.index, contact });
            }
        },
        role: {
            get(){
                return this.contact.role
            },
            set(role){
                const contact = Object.assign(this.contact);
                contact.role = role
                this.$emit("event-edit-contact", { index: this.index, contact });
            }
        },
    },
    methods: {
        remove(){
            this.$emit("event-remove-contact", { index: this.index, contact: this.contact } )
        },
    }
}
</script>
<style lang="less" scoped src="../form/style.less"></style>
<style lang="less" scoped>
    .item-contact{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "content buttonTrash" "alert alert";
        grid-template-columns: 1fr auto;
        grid-template-rows: repeat(2, auto);

        padding-bottom: 26px;
        margin-bottom: 24px;
        border-bottom: dashed 1px gray;
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
        align-self: center;

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

    .ctn-warning{
        grid-row: alert;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

</style>