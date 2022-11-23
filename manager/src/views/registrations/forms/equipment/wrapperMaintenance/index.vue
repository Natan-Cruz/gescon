<template>
    <div>
        <p class="title_2">Manutenções</p>

        <template v-if="maintenances && maintenances.length">
            <ul class="ctn">
                <span class="line-detail" ref="line_detail"></span>
                <item 
                    v-for="maintenance in maintenances" 
                    :key="maintenance.id" 
                    :maintenance="maintenance"
                    @click="$emit('select-item', maintenance.id)" />
            </ul>
        </template>
        <p class="text-without-transaction" v-else>Nenhuma manutenção</p>

        <button class="button button-primary text-medium button-add" @click="$emit('select-item')" :disabled="disabled">Adicionar manutenção</button>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import item from './item.vue'
export default {
    name: "wrapper-historical-payments",
    components: { item },
    props: {
        maintenances: Array,
        disabled: Boolean
    },
    setup(){
        const line_detail = ref(null);

        onMounted(() => {
            const balls = document.querySelectorAll(".ball-detail")
            if(!balls.length) return;

            const firstBall = balls[0], lastBall = balls[ balls.length - 1]
            const distanceBetweenBalls = lastBall.getBoundingClientRect().y - firstBall.getBoundingClientRect().y
            line_detail.value.style.height = distanceBetweenBalls + "px"
        })

        return {
            line_detail
        }
    }
}
</script>

<style lang="less" scoped>
    .ctn{
        position: relative;
    }

    .line-detail{
        display:block;
        width: 2px;
        height: 100%;
        background-color: #f70;
        position: absolute;
        left: 7px;
        top: 10px;
    }

    .text-without-transaction{
        font-size: 1.7em;
        margin-top: 32px;
        text-align: center;
    }
</style>