<template>
    <div>
        <div class="container-table" v-if="check_items.length">
            <table>
                <thead>
                    <tr>
                        <th>Descrição da verificação</th>
                        <th>Método de verificação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="( item, i) in check_items" :key="i">
                        <td>{{ item.verification_description }}</td>
                        <td>{{ item.verification_method }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="without-item" v-else>Nenhum item</p>

        <button >Adicioanr</button>
    </div>
</template>

<script>
export default {
    props: {
        check_items: {
            type:  Array,
            required: false,
            default: () => []
        }
    },
    setup(){

    }
}
</script>

<style lang="less" scoped>

</style>