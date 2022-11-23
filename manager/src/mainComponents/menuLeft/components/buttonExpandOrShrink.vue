<template>
    <button class="button-expand-or-shrink" :class="{ 'is-open': isExpanded }"> 
        <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
    </button>
</template>

<script>
export default {
    name: "button-expand-or-shrink",
    props: {
        isExpanded: Boolean
    }
}
</script>

<style lang="less" scoped>
    .button-expand-or-shrink{
        width: 36px;
        height: 36px;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #fff;
        border: none;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        border-radius: 50%;
            
        position: absolute;
        right: -15px;
        bottom: 16px;

        transition: 240ms ease-in;
        transform: rotate(180deg);

        &:active{
            transform: scale(.7);
        }

        svg{
            fill: #f70;
        }
    }   
    .is-open{
        transform: rotate(0);
    }

    @media screen and (max-width: 1000px) {
        .button-expand-or-shrink{
            display: none;
        }
    }
</style>