<template>
    <li class="item-construction" :class="{ 'is-selected': isSelected }" @click="handleSelectConstruction">
        <div class="ctn-image">
            <img :src="construction.banner_file_url" alt="">
        </div>
        <p class="name">{{ construction.name }}</p>
    </li>
</template>

<script>
export default {
    props: {
        construction: Object,
        isSelected: Boolean
    },
    setup(props, { emit }){
        function handleSelectConstruction(){
            if(!props.isSelected) 
                emit("select-construction", props.construction.id)
        }

        return {
            handleSelectConstruction
        }
    }
}
</script>

<style lang="less" scoped>
    .item-construction{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 3px;
        border-radius: 5px;

        cursor: pointer;

        &:hover{
            background-color: rgba(240, 240, 240, 0.8);
        }

        &:last-child{
            margin-bottom: 0;
        }
    }
    .is-selected{
        background-color: rgb(240, 240, 240);
        font-weight: bold;
    }

    .ctn-image{
        width: 40px;
        height: 40px;

        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: solid 1px #dfdfdf;
        background-color: #fff;
        img{
            width: 100%;
        }
    }

    .name{
        font-size: 1.6em;
        margin-left: 16px;
        color: #000
    }
</style>