<template>
    <div v-if="check">
        <p class="title">Verificações</p>

        <div class="container-verifications">
            <p>{{ check.description }}</p>
        </div>

        <ul>   
            <li class="item" v-for="( item, i ) in check.check_items" :key="i">
                <p class="bold">{{ item.verification_description }}</p>
                <p>{{ item.verification_method }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: { check: Object }
}
</script>

<style lang="less" scoped>
    .container-verifications{
        background-color: rgb(255, 102, 0);
        padding: 14px 10px;
        color: #fff;
        font-weight: bold;

        p{
            font-size: 1.7em;
        }
    }
    .title{
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 12px;
    }
    .item{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        border-bottom: solid 1px rgb(206, 206, 206);
        padding: 8px 0;
        p{
            font-size: 1.7em;
        }
    }
</style>