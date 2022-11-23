<template>
    <li class="li-page" :class="{ 'is-expanded': isExpanded }" tabindex="1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path d="M12 20 4 12 12 4 13.425 5.4 7.825 11H20V13H7.825L13.425 18.6Z"/>
        </svg>
        <p class="link-page">Voltar</p>
    </li>
</template>

<script>
export default {
    name: "item-back-navigation",
    props:{
        path: String,
        isExpanded: Boolean
    }
}
</script>

<style lang="less" scoped>
    .li-page {
        width: 100%;
        height: auto;
        position: relative;
        cursor: pointer;
        width: 100%;
        align-items: center;
        padding: 12px 20px;
        &:active {
            background: rgba(124, 124, 124, 0.1);
            transition: 50ms ease;
        }
        &:hover {
            background: rgba(134, 134, 134, 0.1);
        }
        display: flex;
        border-bottom: dashed 1px gray;
    }

    .link-page {
        font-size: 1.5em;
        color: #000;
        padding-left: 12px;
        display: none;
    }
    
    .is-expanded .link-page{
        display: block;
    }

    @media screen and (max-width:1000px) {
        .link-page{
            display: block;
        }
    }
</style>