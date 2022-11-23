<template>
    <div>
        <ul v-if="check_items.length">
            <li class="item" v-for="( item, i ) in check_items" :key="i" @click="$emit('select-item', item.id)">
                <div >
                    <p class="bold">{{ item.name }}</p>
                    <p>{{ item.check_method }}</p>

                    <template v-if="item.problem_description || item.corretive_actions">
                        <hr>
                        
                        <p style="color: rgb(245, 23, 32)">{{ item.problem_description }}</p>
                        <p style="color: rgb(245, 23, 32)">{{ item.corretive_actions }}</p>
                    </template>
                </div>
            </li>
        </ul>

        <button class="button button-primary text-medium button-add" @click="$emit('select-item')">Adicionar item</button>
    </div>
</template>

<script>

export default {
    emits: ["select-item"],
    props: {
        check_items: {
            type:  Array,
            required: false,
            default: () => []
        },
        disabled: {
            type: Boolean,
            required: false
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        min-height: 70px;

        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        padding: 15px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        border-radius: 6px;
        margin-bottom: 16px;

        p{
            font-size: 1.7em;
            line-height: 1em;
            margin-bottom: 4px;
        }

        &:hover{
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            cursor: pointer;
        }
    }

    hr{
        border: none;
        border-bottom: dashed 1px gray;
        margin: 12px 0;
    }

    .button-add{
        width: auto;
        height: auto;
        margin-bottom: 16px;

        padding: 12px;
    }
</style>