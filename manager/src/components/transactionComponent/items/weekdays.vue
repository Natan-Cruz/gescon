<template>
    <ul>   
        <li v-for="(day, n) in labels" :key="n">
            <checkbox type="radio" name="weekday" :label="day" :value="n === weekday" @change="$emit('update', n)"/>
        </li>
    </ul>
</template>

<script>

export default {
    name: "weekdays",
    props: {
        weekday: {
            type: Number,
            required: true,
        }
    },
    setup(){
        const labels = [
            "Segunda-feita",
            "Terca-feira",
            "Quarta-feira",
            "Quinta-feita",
            "Sexta-feira",
            "Sabado",
            "Domingo"
        ]
        return { labels }
    }
}
</script>

<style lang="less" scoped>
    ul{
        li{
            margin-bottom: 12px;

            &:last-child{
                margin-bottom: 0;
            }
        }
    }
</style>